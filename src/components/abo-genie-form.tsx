"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getPrediction } from "@/app/actions";
import type { PredictBloodTypeOutput } from "@/ai/flows/predict-blood-type";

const formSchema = z.object({
  fatherBloodType: z.enum(["A", "B", "AB", "O"], {
    required_error: "Father's blood type is required.",
  }),
  motherBloodType: z.enum(["A", "B", "AB", "O"], {
    required_error: "Mother's blood type is required.",
  }),
  knownGenotype: z.string().optional(),
  familyHistory: z.string().optional(),
});

type PredictionFormProps = {
  setIsLoading: (isLoading: boolean) => void;
  setPredictionResult: (result: PredictBloodTypeOutput | null) => void;
  setPredictionError: (error: string | null) => void;
  isLoading: boolean;
};

export function PredictionForm({
  setIsLoading,
  setPredictionResult,
  setPredictionError,
  isLoading,
}: PredictionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knownGenotype: "",
      familyHistory: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPredictionResult(null);
    setPredictionError(null);

    const result = await getPrediction(values);

    if (result.success) {
      setPredictionResult(result.data);
    } else {
      setPredictionError(result.error);
    }
    setIsLoading(false);
  }

  const bloodTypes = ["A", "B", "AB", "O"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fatherBloodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father's Blood Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="motherBloodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother's Blood Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="knownGenotype"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Known Genotype (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AA, AO, BB, BO, AB, OO" {...field} />
              </FormControl>
              <FormDescription>
                Provide any known genotype for more accurate prediction.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="familyHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relevant Family History (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Blood disorders, specific genotypes in family members..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any additional information can help refine the prediction.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Predict My Blood Type
        </Button>
      </form>
    </Form>
  );
}
