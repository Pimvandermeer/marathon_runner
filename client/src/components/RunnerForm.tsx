import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { runnerInputSchema, type RunnerInput, waveStartTimes } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { formatPaceInput, validatePaceInput } from "@/lib/utils";
import { calculateRunnerPredictions } from "@/data/staticData";
import { useMutation } from '@tanstack/react-query'; // Added import

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

  const handlePaceChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const formattedValue = formatPaceInput(e.target.value);
    onChange(formattedValue);
  };
  
  const handleFinishTimeChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    // Simple format validation for hh:mm
    let value = e.target.value.replace(/[^0-9:]/g, '');
    
    // Add colon if needed
    if (value.length === 2 && !value.includes(':')) {
      value += ':';
    }
    
    // Limit to 5 characters (hh:mm)
    if (value.length > 5) {
      value = value.substring(0, 5);
    }
    
    onChange(value);
  };

  const onSubmit = (data: RunnerInput) => {
    setIsCalculating(true);

    try {
      // Use the static calculation function instead of API call
      const result = calculateRunnerPredictions(data);

      // Pass the result to the parent component
      onSubmitSuccess(result);

      toast({
        title: "Runner timeline calculated",
        description: "Your runner's timeline has been successfully calculated.",
      });
    } catch (error: any) {
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
                    <FormLabel>Wave</FormLabel>
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
                        <SelectItem value="1">Wave 1 - 10:00</SelectItem>
                        <SelectItem value="2">Wave 2 - 10:07</SelectItem>
                        <SelectItem value="3">Wave 3 - 10:14</SelectItem>
                        <SelectItem value="4">Wave 4 - 10:21</SelectItem>
                        <SelectItem value="5">Wave 5 - 10:28</SelectItem>
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
                    onClick={() => setInputMethod('pace')}
                    className="flex-1"
                  >
                    Enter Pace
                  </Button>
                  <Button
                    type="button"
                    variant={inputMethod === 'finish' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setInputMethod('finish')}
                    className="flex-1"
                  >
                    Enter Finish Time
                  </Button>
                </div>
                
                {inputMethod === 'pace' ? (
                  <FormField
                    control={form.control}
                    name="pace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Pace (min/km)</FormLabel>
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
                        <FormLabel>Target Finish Time (h:mm)</FormLabel>
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
                    <FormLabel>Runner Name (optional)</FormLabel>
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
                {isCalculating ? 'Calculating...' : 'Calculate Runner Timeline'}
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
            Tips for Supporters
          </h3>
          <ul className="space-y-3 text-sm text-neutral-700">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Arrive at viewing spots 15 minutes early</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Account for public transport delays on marathon day</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Bring water and snacks for your runner</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
              <span>Make brightly colored signs to stand out</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}