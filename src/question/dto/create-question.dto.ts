import { z } from 'zod';
import { questionSchema } from './question.dto';

export const createQuestionSchema = questionSchema.omit({ id: true });

export type CreateQuestionDto = z.infer<typeof createQuestionSchema>;
