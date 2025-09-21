"use client";

import { Droplets, Dna } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { predictGenotypeAndBloodGroupOutput } from "@/ai/flows/predict-genotype-blood-group";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


type PredictionResultProps = {
  isLoading: boolean;
  result: predictGenotypeAndBloodGroupOutput | null;
};

export function PredictionResult({ isLoading, result }: PredictionResultProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-40 w-full" />
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
          <p className="mt-4 text-lg">Your prediction results will appear here.</p>
          <p className="text-sm">
            Fill out the form to get started.
          </p>
        </div>
      </Card>
    );
  }

  const genotypeData = result.genotypeProbabilities.map(p => ({ name: p.type, Probability: p.probability }));
  const bloodGroupData = result.bloodGroupProbabilities.map(p => ({ name: p.type, Probability: p.probability }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          Prediction Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-muted-foreground">
            <Dna className="h-5 w-5 text-accent" />
            Genotype Probabilities
          </h3>
          <div className="mt-4 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genotypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Legend />
                <Bar dataKey="Probability" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-muted-foreground">
            <Droplets className="h-5 w-5 text-primary" />
            Blood Group Probabilities
          </h3>
          <div className="mt-4 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloodGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Legend />
                <Bar dataKey="Probability" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
