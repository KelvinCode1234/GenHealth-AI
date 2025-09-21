"use client";

import { Droplets, Dna, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PredictBloodTypeOutput } from "@/ai/flows/predict-blood-type";

type PredictionResultProps = {
  isLoading: boolean;
  result: PredictBloodTypeOutput | null;
};

export function PredictionResult({ isLoading, result }: PredictionResultProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="flex h-full min-h-[400px] items-center justify-center border-dashed">
        <div className="text-center text-muted-foreground">
          <Droplets className="mx-auto h-12 w-12" />
          <p className="mt-4 text-lg">Your prediction will appear here.</p>
          <p className="text-sm">
            Fill out the form to get started.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          Prediction Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-full bg-primary/10 p-3 text-primary">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-muted-foreground">Predicted Blood Type</h3>
            <p className="text-2xl font-bold text-primary">{result.predictedBloodType}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-full bg-accent/10 p-3 text-accent">
            <Dna className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-muted-foreground">Predicted Genotype</h3>
            <p className="text-2xl font-bold text-accent">{result.predictedGenotype}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-full bg-secondary p-3 text-secondary-foreground">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-muted-foreground">Explanation</h3>
            <p className="text-base text-foreground/90">{result.explanation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
