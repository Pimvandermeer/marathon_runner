import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { runnerInputSchema, type RunnerInput } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { formatPaceInput } from "@/lib/utils";
import { calculateRunnerPredictions } from "@/data/staticData";
import { useMutation } from '@tanstack/react-query'; // Added import
import { useLanguage } from "@/contexts/LanguageContext";
import { getWaveStartTimes } from "@/data/marathonConfig";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, LightbulbIcon, Clock } from "lucide-react";

interface RunnerFormProps {
  onSubmitSuccess: (data: any) => void;
}

export default function RunnerForm({ onSubmitSuccess }: RunnerFormProps) {
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<RunnerInput>({
    resolver: zodResolver(runnerInputSchema),
    defaultValues: {
      wave: undefined,
      pace: "",
      finishTime: "",
      runnerName: "",
    },
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [inputMethod, setInputMethod] = useState<'pace' | 'finish'>('pace');

  // When switching input methods, clear the other field's value
  const handleInputMethodSwitch = (method: 'pace' | 'finish') => {
    if (method === 'pace') {
      form.setValue('finishTime', '');
    } else {
      form.setValue('pace', '');
    }
    setInputMethod(method);
  };

  const handlePaceChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    // First, use basic formatting to handle colons and non-numeric characters
    let value = e.target.value.replace(/[^0-9:]/g, '');
    
    // Only allow one colon
    const colonCount = (value.match(/:/g) || []).length;
    if (colonCount > 1) {
      value = value.substring(0, value.lastIndexOf(':')) + 
        value.substring(value.lastIndexOf(':') + 1);
    }
    
    // Add colon after first digit if there are at least 2 digits and no colon yet
    if (colonCount === 0 && value.length >= 2) {
      value = value.substring(0, 1) + ':' + value.substring(1);
    }
    
    // Handle the seconds part
    if (colonCount === 1) {
      const parts = value.split(':');
      const minutes = parts[0];
      let seconds = parts[1] || '';
      
      // If seconds part is more than 2 digits, truncate to 2
      if (seconds.length > 2) {
        seconds = seconds.substring(0, 2);
      }
      
      // Validate seconds are between 0-59
      if (seconds.length === 2) {
        const secondsNum = parseInt(seconds);
        if (secondsNum > 59) {
          // If seconds > 59, set to 59 (max valid seconds)
          seconds = '59';
        }
      } else if (seconds.length === 1 && parseInt(seconds) > 5) {
        // If it's a single digit and greater than 5, it's invalid for seconds (> 59)
        // So we drop it and keep only the minutes
        value = minutes + ':';
      } else {
        // Otherwise keep it as is, without auto-completion
        value = minutes + ':' + seconds;
      }
      
      // Update value with corrected seconds
      value = minutes + ':' + seconds;
    }
    
    onChange(value);
  };
  
  const handleFinishTimeChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    // Simple format validation for hh:mm
    let value = e.target.value.replace(/[^0-9:]/g, '');
    
    // Only allow one colon
    const colonCount = (value.match(/:/g) || []).length;
    if (colonCount > 1) {
      value = value.substring(0, value.lastIndexOf(':')) + 
        value.substring(value.lastIndexOf(':') + 1);
    }
    
    // Add colon after first digit if there are at least 2 digits and no colon yet
    if (colonCount === 0 && value.length >= 2) {
      value = value.substring(0, 1) + ':' + value.substring(1);
    }
    
    // Format minutes part if needed
    if (colonCount === 1) {
      const parts = value.split(':');
      const hours = parts[0];
      let minutes = parts[1] || '';
      
      // If minutes part is more than 2 digits, truncate to 2
      if (minutes.length > 2) {
        minutes = minutes.substring(0, 2);
      }
      
      // Validate minutes are between 0-59
      if (minutes.length === 2) {
        const minutesNum = parseInt(minutes);
        if (minutesNum > 59) {
          // If minutes > 59, set to 59 (max valid minutes)
          minutes = '59';
        }
      } else if (minutes.length === 1 && parseInt(minutes) > 5) {
        // For a single digit, only allow 0-5 (since second digit can only make 0-59)
        // For consistency with pace input
        value = hours + ':' + minutes;
      } else {
        // Otherwise keep it as is, without auto-completion
        value = hours + ':' + minutes;
      }
      
      // Update value with corrected minutes
      value = hours + ':' + minutes;
    }
    
    // Limit to max of 4 characters (h:mm or hh:m) for raw digits
    if (value.length > 4 && !value.includes(':')) {
      value = value.substring(0, 4);
    } else if (value.length > 5) {
      // For format with colon (h:mm or hh:mm)
      const [hours, mins] = value.split(':');
      if (hours.length > 2) {
        value = hours.substring(0, 2) + ':' + mins;
      }
    }
    
    onChange(value);
  };

  const onSubmit = (data: RunnerInput) => {
    console.log("Form submitted with data:", data);
    setIsCalculating(true);

    try {
      // Check if we have either pace or finish time
      if (!data.pace && !data.finishTime) {
        throw new Error("Either pace or finish time must be provided");
      }

      // Validate the wave is selected
      if (!data.wave) {
        throw new Error("Wave must be selected");
      }

      // Ensure proper formatting for pace and finish time
      if (data.pace) {
        // Check if the pace has the correct format (mm:ss)
        const paceParts = data.pace.split(':');
        if (paceParts.length < 2 || paceParts[1] === '') {
          // If there's no seconds part or it's empty, add :00
          data.pace = paceParts[0] + ':00';
        } else if (paceParts[1].length === 1) {
          // If seconds is a single digit, reject the input
          toast({
            title: "Input Error",
            description: "Please enter seconds as a two-digit number (e.g., 4:30 not 4:3)",
            variant: "destructive",
          });
          throw new Error("Invalid pace format. Please use mm:ss format with two digits for seconds.");
        } else {
          // Validate that seconds are between 0-59
          const [minutes, seconds] = paceParts.map(Number);
          if (seconds > 59) {
            toast({
              title: "Input Error",
              description: "Seconds must be between 0 and 59",
              variant: "destructive",
            });
            throw new Error("Invalid pace format. Seconds must be between 0 and 59.");
          }
          // Format with seconds properly padded
          data.pace = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
      }

      if (data.finishTime) {
        // Check if the finish time has the correct format (h:mm)
        const timeParts = data.finishTime.split(':');
        if (timeParts.length < 2 || timeParts[1] === '') {
          // If there's no minutes part or it's empty, add :00
          data.finishTime = timeParts[0] + ':00';
        } else if (timeParts[1].length === 1) {
          // If minutes is a single digit, reject the input
          toast({
            title: "Input Error",
            description: "Please enter minutes as a two-digit number (e.g., 4:30 not 4:3)",
            variant: "destructive",
          });
          throw new Error("Invalid time format. Please use h:mm format with two digits for minutes.");
        } else {
          // Validate minutes are between 0-59
          const [hours, minutes] = timeParts.map(Number);
          if (minutes > 59) {
            toast({
              title: "Input Error",
              description: "Minutes must be between 0 and 59",
              variant: "destructive",
            });
            throw new Error("Invalid time format. Minutes must be between 0 and 59.");
          }
          // Format with minutes properly padded
          data.finishTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
        }
      }

      console.log("Calculating predictions with:", data);
      // Use the static calculation function instead of API call
      const result = calculateRunnerPredictions(data);
      console.log("Calculation result:", result);

      // Pass the result to the parent component
      onSubmitSuccess(result);

      toast({
        title: "Runner timeline calculated",
        description: "Your runner's timeline has been successfully calculated.",
      });
    } catch (error: any) {
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description: `Failed to calculate runner timeline: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="lg:col-span-1">
      <Card className="bg-white shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">{t("app.runner_information")}</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="wave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.wave")}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("form.select_wave_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(getWaveStartTimes()).map(([wave, time]) => (
                          <SelectItem key={wave} value={wave}>
                            Wave {wave} - {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mb-4">
                <div className="flex space-x-2 mb-2">
                  <Button
                    type="button"
                    variant={inputMethod === 'pace' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputMethodSwitch('pace')}
                    className="flex-1"
                  >
                    {t("form.enterPace")}
                  </Button>
                  <Button
                    type="button"
                    variant={inputMethod === 'finish' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputMethodSwitch('finish')}
                    className="flex-1"
                  >
                    {t("form.enterFinishTime")}
                  </Button>
                </div>
                
                {inputMethod === 'pace' ? (
                  <FormField
                    control={form.control}
                    name="pace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.pace")}</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              placeholder={t("form.example_pace")} 
                              {...field} 
                              onChange={(e) => handlePaceChange(e, field.onChange)}
                              className="font-mono"
                            />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-neutral-500 text-sm">min/km</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {t("form.pace_description")}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="finishTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.finishTime")}</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              placeholder={t("form.example_finish")} 
                              {...field} 
                              onChange={(e) => handleFinishTimeChange(e, field.onChange)}
                              className="font-mono"
                            />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-neutral-500 text-sm">hours</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {t("form.finish_description")}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="runnerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.runnerName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("form.enter_name")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-primary text-white hover:bg-opacity-90"
                disabled={isCalculating}
              >
                <Clock className="mr-2 h-4 w-4" />
                {isCalculating ? t("app.calculating") : t("form.calculate")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-white shadow-md mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-neutral-900 mb-3 flex items-center">
            <LightbulbIcon className="h-5 w-5 mr-2 text-amber-400" />
            {t("tips.title")}
          </h3>
          <ul className="space-y-3 text-sm text-neutral-700">
            <li className="flex items-start">
              <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span>{t("tips.early")}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span>{t("tips.transport")}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span>{t("tips.supplies")}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={16} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span>{t("tips.signs")}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}