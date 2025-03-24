import { Prisma } from '@prisma/client';

export const QUIZ_SORT_FIELDS: Record<
  `${string}:${'asc' | 'desc'}`,
  Prisma.QuizOrderByWithRelationInput
> = {
  'name:asc': { name: 'asc' },
  'name:desc': { name: 'desc' },

  'questions:asc': { questions: { _count: 'asc' } },
  'questions:desc': { questions: { _count: 'desc' } },

  'responses:asc': { responses: { _count: 'asc' } },
  'responses:desc': { responses: { _count: 'desc' } },

  'created_at:asc': { created_at: 'asc' },
  'created_at:desc': { created_at: 'desc' },
};
