"use client";

import { useState } from "react";
import { PredictionForm } from "@/components/abo-genie-form";
import { PredictionResult } from "@/components/prediction-result";
import { AlertTriangle, Droplets } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { PredictBloodTypeOutput } from "@/ai/flows/predict-blood-type";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictBloodTypeOutput | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">ABO Genie</h1>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-8 md:grid-cols-2 md:py-12">
          <div className="flex flex-col space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Predict Your Blood Type</h2>
            <p className="text-muted-foreground">
              Enter information about your parents to get a prediction of your possible blood type and genotype. The more information you provide, the more accurate the prediction will be.
            </p>
            <PredictionForm
              setIsLoading={setIsLoading}
              setPredictionResult={setPredictionResult}
              setPredictionError={setPredictionError}
              isLoading={isLoading}
            />
          </div>

          <div className="relative">
            <PredictionResult isLoading={isLoading} result={predictionResult} />
          </div>
        </div>
        {predictionError && (
          <div className="container mx-auto px-4 pb-8">
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{predictionError}</AlertDescription>
              </Alert>
          </div>
        )}
      </main>

      <footer className="border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <Alert variant="default" className="border-accent">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <AlertTitle className="font-semibold text-accent">Disclaimer</AlertTitle>
            <AlertDescription className="text-foreground/80">
              The predictions provided by ABO Genie are for informational and educational purposes only. They are based on genetic probability and AI models, and are not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </AlertDescription>
          </Alert>
        </div>
      </footer>
    </div>
  );
}
