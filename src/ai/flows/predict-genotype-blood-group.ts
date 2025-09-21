'use server';

/**
 * @fileOverview AI agent that predicts genotype and blood group probabilities based on user input.
 *
 * - predictGenotypeAndBloodGroup - Function to predict genotype and blood group.
 * - predictGenotypeAndBloodGroupInput - Input type for the function.
 * - predictGenotypeAndBloodGroupOutput - Output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const predictGenotypeAndBloodGroupInputSchema = z.object({
  fatherBloodType: z
    .string()
    .describe("Father's blood group (e.g., A+, O-)."),
  motherBloodType: z
    .string()
    .describe("Mother's blood group (e.g., B+, AB-)."),
  fatherGenotype: z
    .string()
    .optional()
    .describe("Father's known genotype (e.g., AA, AS)."),
  motherGenotype: z
    .string()
    .optional()
    .describe("Mother's known genotype (e.g., AA, AS)."),
  ethnicity: z.string().optional().describe('User ethnicity/region.'),
  healthNotes: z
    .string()
    .optional()
    .describe('Any relevant health notes from the user.'),
});

export type predictGenotypeAndBloodGroupInput = z.infer<typeof predictGenotypeAndBloodGroupInputSchema>;

const ProbabilitySchema = z.object({
  type: z.string().describe('The genotype or blood group type.'),
  probability: z.number().describe('The probability in percent (e.g., 70 for 70%).'),
});

const predictGenotypeAndBloodGroupOutputSchema = z.object({
  genotypeProbabilities: z
    .array(ProbabilitySchema)
    .describe('An array of possible genotypes and their probabilities.'),
  bloodGroupProbabilities: z
    .array(ProbabilitySchema)
    .describe('An array of possible blood groups and their probabilities.'),
});

export type predictGenotypeAndBloodGroupOutput = z.infer<typeof predictGenotypeAndBloodGroupOutputSchema>;

export async function predictGenotypeAndBloodGroup(input: predictGenotypeAndBloodGroupInput): Promise<predictGenotypeAndBloodGroupOutput> {
  return predictGenotypeAndBloodGroupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictGenotypeAndBloodGroupPrompt',
  input: {schema: predictGenotypeAndBloodGroupInputSchema},
  output: {schema: predictGenotypeAndBloodGroupOutputSchema},
  prompt: `You are a genetics expert. Your task is to predict a person's possible genotypes and blood groups based on their parents' information. Use established Mendelian inheritance rules.

  Information provided:
  - Father's Blood Group: {{{fatherBloodType}}}
  - Mother's Blood Group: {{{motherBloodType}}}
  - Father's Genotype: {{{fatherGenotype}}}
  - Mother's Genotype: {{{motherGenotype}}}
  - Ethnicity/Region: {{{ethnicity}}}
  - Health Notes: {{{healthNotes}}}

  1.  **Genotype Prediction**:
      - If parents' genotypes are provided, calculate the exact probabilities for the offspring's genotype (e.g., AA, AS, SS, AC, SC, CC).
      - If genotypes are not provided, use blood groups and ethnicity to estimate probabilities. Certain genotypes are more prevalent in specific regions (e.g., AS in West Africa).
      - Present the results as an array of objects, each with 'type' and 'probability'. The sum of probabilities must be 100.

  2.  **Blood Group Prediction**:
      - Based on the parents' ABO and Rh factor blood groups, calculate the probabilities for the offspring's possible blood groups (e.g., A+, O-, B+).
      - Remember that O is recessive to A and B. A and B are co-dominant. Rh+ is dominant over Rh-.
      - Present the results as an array of objects, each with 'type' and 'probability'. The sum of probabilities must be 100.

  Your response must be in the specified JSON format.
  `,
});

const predictGenotypeAndBloodGroupFlow = ai.defineFlow(
  {
    name: 'predictGenotypeAndBloodGroupFlow',
    inputSchema: predictGenotypeAndBloodGroupInputSchema,
    outputSchema: predictGenotypeAndBloodGroupOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
