"use client";

import { useState } from "react";
import { PredictionForm } from "@/components/genhealth-form";
import { PredictionResult } from "@/components/prediction-result";
import { AlertTriangle, Droplets, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { predictGenotypeAndBloodGroupOutput } from "@/ai/flows/predict-genotype-blood-group";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<predictGenotypeAndBloodGroupOutput | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">GenHealth AI</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Understanding Your Results</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] pr-6">
                <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                  <h3 className="text-lg font-semibold">What does Genotype mean?</h3>
                  <p>Genotype refers to your genetic makeup, specifically the combination of alleles for a particular gene. For hemoglobin, common genotypes include AA, AS, and SS. Knowing your genotype is crucial for understanding your risk of inheriting or passing on genetic conditions like sickle cell anemia.</p>
                  <h3 className="text-lg font-semibold">What does Blood Group mean?</h3>
                  <p>Your blood group (or blood type) is determined by the presence or absence of specific antigens on the surface of your red blood cells. The main blood groups are A, B, AB, and O, each of which can be Rh-positive (+) or Rh-negative (-). Your blood group is important for blood transfusions and during pregnancy.</p>
                  <h3 className="text-lg font-semibold">Marriage/Compatibility Implications</h3>
                  <p>When planning for a family, knowing your and your partner's genotype is important. For example, if both partners have the AS genotype, there is a 25% chance of having a child with SS genotype (sickle cell anemia) in each pregnancy. Blood group compatibility (especially the Rh factor) is also important to prevent issues like Rh disease in newborns.</p>
                  <h3 className="text-lg font-semibold">Health Importance</h3>
                  <p>Knowing your genotype and blood group is vital for your health. It can help in emergency situations requiring blood transfusions, inform family planning decisions, and help you understand your risk for certain genetic conditions. This knowledge empowers you to make informed decisions about your health and lifestyle.</p>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-8 md:grid-cols-2 md:py-12">
          <div className="flex flex-col space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Predict Your Genotype & Blood Group</h2>
            <p className="text-muted-foreground text-balance">
              Enter your parents' details to get an AI-powered prediction of your possible genotype and blood group probabilities.
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
            This is only an estimation. Please confirm with a certified medical lab test. The predictions provided are for informational and educational purposes only and are not a substitute for professional medical advice.
            </AlertDescription>
          </Alert>
        </div>
      </footer>
    </div>
  );
}
