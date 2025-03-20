import { z } from 'zod';

export const createAnswerSchema = z
  .object({
    text: z.string().optional(),
    question_id: z.string(),
    // selected_options: z.array()
  })
  .strict();

export type CreateAnswerDto = z.infer<typeof createAnswerSchema>;
