import { createQuizQuestionSchema } from 'src/questions/dto/create-quiz-question.dto';
import { z } from 'zod';

export const createQuizSchema = z.object({
  name: z.string(),
  description: z.string(),
  questions: z.array(createQuizQuestionSchema.strict()).min(1),
}).strict();

export type CreateQuizDto = z.infer<typeof createQuizSchema>;
