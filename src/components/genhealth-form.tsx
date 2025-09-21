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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getPrediction } from "@/app/actions";
import type { predictGenotypeAndBloodGroupOutput } from "@/ai/flows/predict-genotype-blood-group";
import { Input } from "./ui/input";

const formSchema = z.object({
  fatherBloodType: z.string().min(1, "Father's blood group is required."),
  motherBloodType: z.string().min(1, "Mother's blood group is required."),
  fatherGenotype: z.string().optional(),
  motherGenotype: z.string().optional(),
  ethnicity: z.string().optional(),
  healthNotes: z.string().optional(),
});

type PredictionFormProps = {
  setIsLoading: (isLoading: boolean) => void;
  setPredictionResult: (result: predictGenotypeAndBloodGroupOutput | null) => void;
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
      fatherGenotype: "",
      motherGenotype: "",
      ethnicity: "",
      healthNotes: "",
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

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genotypes = ["AA", "AS", "AC", "SS", "SC", "CC"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fatherBloodType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Blood Group</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bloodTypes.map((type) => (
                      <SelectItem key={`father-blood-${type}`} value={type}>
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
                <FormLabel>Mother's Blood Group</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bloodTypes.map((type) => (
                      <SelectItem key={`mother-blood-${type}`} value={type}>
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
            control={form.control}
            name="fatherGenotype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Genotype (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select genotype" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genotypes.map((type) => (
                      <SelectItem key={`father-geno-${type}`} value={type}>
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
            name="motherGenotype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Genotype (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select genotype" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genotypes.map((type) => (
                      <SelectItem key={`mother-geno-${type}`} value={type}>
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
          name="ethnicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ethnicity/Region (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., West African, European" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Family history of blood disorders"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Predict
        </Button>
      </form>
    </Form>
  );
}