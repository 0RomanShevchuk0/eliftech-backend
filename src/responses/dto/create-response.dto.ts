import { z } from 'zod';
import { createAnswerSchema } from '../answers/dto/create-answer.dto';

export const createResponseSchema = z
  .object({
    completion_time: z.number(),
    submitted_at: z.date(),
    quiz_id: z.string(),
    answers: z.array(createAnswerSchema),
  })
  .strict();

export type CreateResponseDto = z.infer<typeof createResponseSchema>;
