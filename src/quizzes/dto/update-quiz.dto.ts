import { updateQuizQuestionSchema } from 'src/questions/dto/update-quiz-question.dto';
import { createQuizSchema } from './create-quiz.dto';
import { z } from 'zod';

const questionArraySchema = z.array(updateQuizQuestionSchema).min(1);

export const updateQuizSchema = createQuizSchema
  .omit({ questions: true })
  .extend({
    id: z.string().uuid(),
    questions: questionArraySchema,
  });

export type UpdateQuizDto = z.infer<typeof updateQuizSchema>;
