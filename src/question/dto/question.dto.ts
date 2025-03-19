import { createQuestionSchema } from 'src/question/dto/create-question.dto';
import { z } from 'zod';

export const QuestionTypeSchema = z.enum(['text']);

export const questionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  type: QuestionTypeSchema,
  order: z.number(),
  quiz_id: z.string().uuid(),
});

export type QuestionDto = z.infer<typeof questionSchema>;
