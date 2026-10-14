import type { RunnerInput } from "@shared/schema";

/**
 * Pace and passing-time math. Pure: the caller passes the marathon pack, so
 * every number a supporter sees is reproducible from (input, pack).
 * Pinned by staticData.test.ts (R11 regression contract): do not change the
 * arithmetic or the output format without updating that contract on purpose.
 *
 * There is deliberately no "current position" here (decision D8): race-day
 * tracking belongs to the organiser's app.
 */

/** The minimum a pack must provide for predictions. */
export interface PredictionPack<L extends { kilometer: number }> {
  waveStartTimes: Record<string, string>;
  viewingLocations: readonly L[];
  /** Latest start-line crossing for the last wave, from the organiser (HH:MM). */
  startWindowEnd?: string;
}

/** estimatedTime: crossing the line as the wave starts. latestTime: crossing at the end of the wave's window. */
export type Timed<L> = L & { estimatedTime: string; latestTime: string };

export interface RunnerPrediction<L> {
  locationTimes: Timed<L>[];
  estimatedFinish: string;
  latestFinish: string;
  /** Minutes a runner in this wave may cross the start line after the wave starts. */
  crossingMinutes: number;
  runner: { id: string; name: string; wave: string; pace: string };
}

const MARATHON_KM = 42.195;

// Convert pace (m:ss, or bare minutes) to minutes per km; unparsable input gives 0.
function paceToMinutes(pace: string): number {
  if (!pace || pace.trim() === "") return 0;
  if (pace.includes(":")) {
    const parts = pace.split(":");
    const minutes = parseInt(parts[0] || "0", 10);
    const seconds = parseInt(parts[1] || "0", 10);
    return minutes + seconds / 60;
  }
  return parseInt(pace, 10) || 0;
}

// Add minutes to an HH:MM base time. Output is H:MM (hours unpadded, minutes
// floored and zero-padded); this format is part of the regression contract.
function addTime(baseTime: string, minutesToAdd: number): string {
  const [hours, minutes] = baseTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = Math.floor(totalMinutes % 60).toString().padStart(2, "0");
  return `${newHours}:${newMinutes}`;
}

// Target finish time (h:mm, or bare total minutes) to an even pace (m:ss).
function calculatePaceFromFinishTime(finishTime: string): string {
  if (!finishTime || finishTime.trim() === "") return "0:00";
  let totalFinishMinutes = 0;
  if (finishTime.includes(":")) {
    const parts = finishTime.split(":");
    totalFinishMinutes = parseInt(parts[0] || "0", 10) * 60 + parseInt(parts[1] || "0", 10);
  } else {
    totalFinishMinutes = parseInt(finishTime, 10) || 0;
  }
  const paceMinutes = totalFinishMinutes / MARATHON_KM;
  const mins = Math.floor(paceMinutes);
  const secs = Math.round((paceMinutes - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * How long after its start a wave may still be crossing the start line:
 * until the next wave starts, and for the last wave until the organiser's
 * start window ends. 0 when neither is known. An estimate, not an organiser
 * figure per wave; the UI says so.
 */
export function crossingMinutes(
  pack: { waveStartTimes: Record<string, string>; startWindowEnd?: string },
  wave: string,
): number {
  const waves = Object.keys(pack.waveStartTimes);
  const i = waves.indexOf(wave);
  if (i === -1) return 0;
  const end = i + 1 < waves.length ? pack.waveStartTimes[waves[i + 1]] : pack.startWindowEnd;
  return end ? Math.max(0, toMinutes(end) - toMinutes(pack.waveStartTimes[wave])) : 0;
}

export function getMarathonLocations<L extends { kilometer: number }>(pack: PredictionPack<L>): L[] {
  return [...pack.viewingLocations];
}

export function calculateRunnerPredictions<L extends { kilometer: number }>(
  runnerInput: RunnerInput,
  pack: PredictionPack<L>,
): RunnerPrediction<L> {
  const { wave, pace, finishTime, runnerName, id } = runnerInput;

  if (!wave) throw new Error("Wave must be selected");
  const startTime = pack.waveStartTimes[wave];
  if (!startTime) throw new Error(`Unknown wave "${wave}" for this marathon`);

  // A pace wins over a finish time; with neither, the 5:30 fallback applies
  // (form validation rejects that case before it gets here).
  let effectivePace = "5:30";
  if (pace && pace.trim() !== "") {
    effectivePace = pace;
  } else if (finishTime && finishTime.trim() !== "") {
    effectivePace = calculatePaceFromFinishTime(finishTime);
  }

  const paceInMinutes = paceToMinutes(effectivePace);
  if (paceInMinutes <= 0 || paceInMinutes > 15) {
    throw new Error("Invalid pace value. Please enter a valid pace or finish time.");
  }

  const runnerId = id || `runner-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const crossing = crossingMinutes(pack, wave);
  const locationTimes = pack.viewingLocations.map((location) => ({
    ...location,
    estimatedTime: addTime(startTime, location.kilometer * paceInMinutes),
    latestTime: addTime(startTime, crossing + location.kilometer * paceInMinutes),
  }));

  return {
    locationTimes,
    estimatedFinish: addTime(startTime, MARATHON_KM * paceInMinutes),
    latestFinish: addTime(startTime, crossing + MARATHON_KM * paceInMinutes),
    crossingMinutes: crossing,
    runner: { id: runnerId, name: runnerName || "Runner", wave, pace: effectivePace },
  };
}
