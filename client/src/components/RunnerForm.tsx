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
    const formattedValue = formatPaceInput(e.target.value);
    onChange(formattedValue);
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
    
    // Format seconds part if needed
    if (colonCount === 1) {
      const [hours, minutes] = value.split(':');
      
      // If minutes part is more than 2 digits, truncate to 2
      if (minutes && minutes.length > 2) {
        value = `${hours}:${minutes.substring(0, 2)}`;
      }
      
      // Add leading zero to minutes if needed
      if (minutes && minutes.length === 1) {
        value = `${hours}:${minutes.padStart(2, '0')}`;
      }
    }
    
    // Limit to max of 4 characters (h:mm or hh:m)
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
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Runner Information</h2>

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
                          <SelectValue placeholder="Select wave" />
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
                              placeholder="e.g. 5:30" 
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
                          The pace you expect to maintain throughout the marathon
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
                              placeholder="e.g. 4:30" 
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
                          Your target total marathon time
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
                      <Input placeholder="Enter name" {...field} />
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
                {isCalculating ? 'Calculating...' : t("form.calculate")}
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
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>{t("tips.early")}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>{t("tips.transport")}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>{t("tips.supplies")}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>{t("tips.signs")}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}