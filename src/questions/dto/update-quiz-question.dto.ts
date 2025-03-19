import { z } from 'zod';
import { questionSchema } from './question-base.dto';
import { updateQuizOptionSchema } from '../options/dto/update-quiz-option.dto';

export const updateQuizQuestionSchema = questionSchema
  .omit({ options: true })
  .partial({ id: true })
  .extend({
    options: z.array(updateQuizOptionSchema).optional(),
  });

export type UpdateQuizQuestionDto = z.infer<typeof updateQuizQuestionSchema>;
