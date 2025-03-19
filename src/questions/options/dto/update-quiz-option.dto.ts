import { z } from 'zod';
import { optionSchema } from './option-base.dto';

export const updateQuizOptionSchema = optionSchema.partial({ id: true });

export type UpdateQuizOptioDto = z.infer<typeof updateQuizOptionSchema>;
