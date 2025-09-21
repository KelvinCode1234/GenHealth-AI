// This file contains the Genkit flow for providing an explanation of the blood type and genotype prediction based on user input.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainPredictionInputSchema = z.object({
  personalInformation: z.string().describe('Personal information of the user including family history, ethnicity, and any relevant medical background.'),
  predictedBloodType: z.string().describe('The predicted blood type for the user.'),
  predictedGenotype: z.string().describe('The predicted genotype for the user.'),
});

export type ExplainPredictionInput = z.infer<typeof ExplainPredictionInputSchema>;

const ExplainPredictionOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of why the given blood type and genotype were predicted based on the provided personal information.'),
});

export type ExplainPredictionOutput = z.infer<typeof ExplainPredictionOutputSchema>;

export async function explainPrediction(input: ExplainPredictionInput): Promise<ExplainPredictionOutput> {
  return explainPredictionFlow(input);
}

const explainPredictionPrompt = ai.definePrompt({
  name: 'explainPredictionPrompt',
  input: {schema: ExplainPredictionInputSchema},
  output: {schema: ExplainPredictionOutputSchema},
  prompt: `Given the following personal information, predicted blood type, and predicted genotype, explain the reasoning behind the prediction.

Personal Information: {{{personalInformation}}}
Predicted Blood Type: {{{predictedBloodType}}}
Predicted Genotype: {{{predictedGenotype}}}

Explanation:`,
});

const explainPredictionFlow = ai.defineFlow(
  {
    name: 'explainPredictionFlow',
    inputSchema: ExplainPredictionInputSchema,
    outputSchema: ExplainPredictionOutputSchema,
  },
  async input => {
    const {output} = await explainPredictionPrompt(input);
    return output!;
  }
);
