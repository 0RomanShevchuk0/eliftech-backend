import { z } from 'zod';
import { optionSchema } from './option-base.dto';

export const updateQuizOptionSchema = optionSchema
  .omit({ question_id: true })
  .partial({ id: true });

export type UpdateQuizOptionDto = z.infer<typeof updateQuizOptionSchema>;
