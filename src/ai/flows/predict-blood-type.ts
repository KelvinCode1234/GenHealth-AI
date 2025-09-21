'use server';

/**
 * @fileOverview AI agent that predicts blood type and genotype based on user input.
 *
 * - predictBloodType - Function to predict blood type and genotype.
 * - PredictBloodTypeInput - Input type for predictBloodType function.
 * - PredictBloodTypeOutput - Output type for predictBloodType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictBloodTypeInputSchema = z.object({
  fatherBloodType: z
    .string()
    .describe('Father\'s blood type (A, B, AB, O)'),
  motherBloodType: z
    .string()
    .describe('Mother\'s blood type (A, B, AB, O)'),
  knownGenotype: z
    .string()
    .optional()
    .describe('Known genotype (optional, e.g., AA, AO, BB, BO, AB, OO)'),
  familyHistory: z
    .string()
    .optional()
    .describe('Relevant family history (optional)'),
});

export type PredictBloodTypeInput = z.infer<typeof PredictBloodTypeInputSchema>;

const PredictBloodTypeOutputSchema = z.object({
  predictedBloodType: z.string().describe('Predicted blood type.'),
  predictedGenotype: z.string().describe('Predicted genotype.'),
  explanation: z.string().describe('Explanation of the prediction.'),
});

export type PredictBloodTypeOutput = z.infer<typeof PredictBloodTypeOutputSchema>;

export async function predictBloodType(input: PredictBloodTypeInput): Promise<PredictBloodTypeOutput> {
  return predictBloodTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictBloodTypePrompt',
  input: {schema: PredictBloodTypeInputSchema},
  output: {schema: PredictBloodTypeOutputSchema},
  prompt: `You are a genetics expert predicting blood type and genotype based on the provided information.

  Given the following information, predict the most likely blood type and genotype. Provide a concise explanation for your prediction.

  Father\'s Blood Type: {{{fatherBloodType}}}
  Mother\'s Blood Type: {{{motherBloodType}}}
  Known Genotype (if any): {{{knownGenotype}}}
  Family History (if any): {{{familyHistory}}}

  Format your response as follows:
  Predicted Blood Type: [Predicted blood type]
  Predicted Genotype: [Predicted genotype]
  Explanation: [Explanation of the prediction]`,
});

const predictBloodTypeFlow = ai.defineFlow(
  {
    name: 'predictBloodTypeFlow',
    inputSchema: PredictBloodTypeInputSchema,
    outputSchema: PredictBloodTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
