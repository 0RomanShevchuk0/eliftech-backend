import { z } from 'zod';
import { questionSchema } from './question-base.dto';
import { createQuizOptionSchema } from '../options/dto/create-quiz-option.dto';

export const createQuizQuestionSchema = questionSchema
  .omit({ id: true, options: true, quiz_id: true })
  .extend({
    options: z.array(createQuizOptionSchema).optional(),
  });

export type CreateQuizQuestionDto = z.infer<typeof createQuizQuestionSchema>;
