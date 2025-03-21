import { z } from 'zod';
import { optionSchema } from './option-base.dto';

export const createQuizOptionSchema = optionSchema.omit({
  id: true,
  question_id: true,
});

export type CreateQuizOptionDto = z.infer<typeof createQuizOptionSchema>;
