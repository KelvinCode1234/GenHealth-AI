'use server';

import { predictGenotypeAndBloodGroup, predictGenotypeAndBloodGroupInput, predictGenotypeAndBloodGroupOutput } from '@/ai/flows/predict-genotype-blood-group';
import { z } from 'zod';

const formSchema = z.object({
  fatherBloodType: z.string().min(1, "Father's blood group is required."),
  motherBloodType: z.string().min(1, "Mother's blood group is required."),
  fatherGenotype: z.string().optional(),
  motherGenotype: z.string().optional(),
  ethnicity: z.string().optional(),
  healthNotes: z.string().optional(),
});

type PredictionResult = {
  success: true;
  data: predictGenotypeAndBloodGroupOutput;
} | {
  success: false;
  error: string;
};

export async function getPrediction(data: predictGenotypeAndBloodGroupInput): Promise<PredictionResult> {
  try {
    const validatedData = formSchema.parse(data);
    const result = await predictGenotypeAndBloodGroup(validatedData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error during prediction:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input. Please check your form entries.' };
    }
    return { success: false, error: 'Failed to get prediction. Please try again later.' };
  }
}
