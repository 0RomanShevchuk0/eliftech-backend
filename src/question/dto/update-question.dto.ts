import { z } from 'zod';
import { questionSchema } from './question.dto';

export const updateQuestionSchema = questionSchema.partial({ id: true });

export type UpdateQuestionDto = z.infer<typeof updateQuestionSchema>;
