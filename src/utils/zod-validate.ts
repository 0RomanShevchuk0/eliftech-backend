import { ZodSchema } from 'zod';
import { BadRequestException } from '@nestjs/common';

export function validateSchema<T>(schema: ZodSchema<T>, data: unknown): T {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new BadRequestException(parsed.error.errors);
  }

  return parsed.data;
}
