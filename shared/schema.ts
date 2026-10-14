import { z } from "zod";

// Runner input from the form or a shared link. Either a pace or a finish
// time must be present.
export const runnerInputSchema = z.object({
  wave: z.string(),
  pace: z.string().optional(),
  finishTime: z.string().optional(),
  runnerName: z.string().optional(),
  id: z.string().optional(),
}).refine(data => {
  return (data.pace && data.pace.trim() !== '') || (data.finishTime && data.finishTime.trim() !== '');
}, {
  message: "Either pace or finish time must be provided",
  path: ["pace"]
});

export type RunnerInput = z.infer<typeof runnerInputSchema>;
