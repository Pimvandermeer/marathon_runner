import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { runnerInputSchema, type RunnerInput, waveStartTimes } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatPaceInput, validatePaceInput } from "@/lib/utils";

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
import { CheckCircle, LightbulbIcon, Timer } from "lucide-react";

interface RunnerFormProps {
  onSubmitSuccess: (data: any) => void;
}

export default function RunnerForm({ onSubmitSuccess }: RunnerFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const form = useForm<RunnerInput>({
    resolver: zodResolver(runnerInputSchema),
    defaultValues: {
      wave: undefined,
      pace: "",
      runnerName: "",
    },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: RunnerInput) => {
      const response = await apiRequest("POST", "/api/calculate-predictions", data);
      return response.json();
    },
    onSuccess: (data) => {
      onSubmitSuccess(data);
      toast({
        title: "Runner timeline calculated",
        description: "Your runner's timeline has been successfully calculated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to calculate runner timeline: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload-csv", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload CSV file");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "File uploaded",
        description: "Your CSV file has been successfully uploaded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to upload CSV file: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RunnerInput) => {
    calculateMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handlePaceChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const formattedValue = formatPaceInput(e.target.value);
    onChange(formattedValue);
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
                        <SelectItem value="2">Wave 2 - 10:15</SelectItem>
                        <SelectItem value="3">Wave 3 - 10:30</SelectItem>
                        <SelectItem value="4">Wave 4 - 10:45</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                disabled={calculateMutation.isPending}
              >
                <Running className="mr-2 h-4 w-4" />
                {calculateMutation.isPending ? 'Calculating...' : 'Calculate Runner Timeline'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">Upload CSV Data</h3>
            <div 
              className="border-2 border-dashed border-neutral-300 rounded-md p-6 text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="space-y-2">
                <FileUpload className="h-6 w-6 mx-auto text-neutral-400" />
                <p className="text-sm text-neutral-600">
                  {selectedFile ? `Selected: ${selectedFile.name}` : "Drag and drop your CSV file here, or"}
                </p>
                <div className="flex justify-center">
                  <label htmlFor="fileUpload" className="text-secondary font-medium text-sm hover:text-secondary hover:underline cursor-pointer">
                    Browse files
                  </label>
                  <input 
                    type="file" 
                    className="hidden" 
                    id="fileUpload" 
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </div>
                {selectedFile && (
                  <Button 
                    onClick={handleUpload} 
                    variant="outline" 
                    className="mt-2"
                    disabled={uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
                  </Button>
                )}
              </div>
            </div>
          </div>
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
