import { createQuestionSchema } from 'src/question/dto/create-question.dto';
import { z } from 'zod';

export const createQuizSchema = z.object({
  name: z.string(),
  description: z.string(),
  questions: z.array(createQuestionSchema.omit({ quiz_id: true }).strict()).min(1),
}).strict();

export type CreateQuizDto = z.infer<typeof createQuizSchema>;
