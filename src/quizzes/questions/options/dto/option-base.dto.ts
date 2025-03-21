import { z } from 'zod';

export const optionSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  question_id: z.string().uuid(),
});

export type OptionDto = z.infer<typeof optionSchema>;
