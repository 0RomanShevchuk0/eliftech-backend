import { z } from 'zod';
import { optionSchema } from '../options/dto/option-base.dto';

export const QuestionTypeSchema = z.enum([
  'TEXT',
  'SINGLE_CHOICE',
  'MULTIPLE_CHOICES',
]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const questionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  type: QuestionTypeSchema,
  order: z.number(),
  quiz_id: z.string().uuid(),

  options: z.array(optionSchema),
});

export type QuestionDto = z.infer<typeof questionSchema>;
