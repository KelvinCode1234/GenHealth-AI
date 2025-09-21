'use server';

import { predictBloodType, PredictBloodTypeInput, PredictBloodTypeOutput } from '@/ai/flows/predict-blood-type';
import { z } from 'zod';

const formSchema = z.object({
  fatherBloodType: z.enum(['A', 'B', 'AB', 'O']),
  motherBloodType: z.enum(['A', 'B', 'AB', 'O']),
  knownGenotype: z.string().optional(),
  familyHistory: z.string().optional(),
});

type PredictionResult = {
  success: true;
  data: PredictBloodTypeOutput;
} | {
  success: false;
  error: string;
};

export async function getPrediction(data: PredictBloodTypeInput): Promise<PredictionResult> {
  try {
    const validatedData = formSchema.parse(data);
    const result = await predictBloodType(validatedData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error during prediction:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input. Please check your form entries.' };
    }
    return { success: false, error: 'Failed to get prediction. Please try again later.' };
  }
}
