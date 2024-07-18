import { z } from 'zod';
export const bookSchema = z.object({
  pk: z.string({
    required_error: 'pk is required',
  }).min(5, 'pk ia a name and must have at least 3 characters'),
  sk: z.string({
    required_error:'sk is required',
  }).min(3, 'sk ia a name and must have at least 3'),
  author: z.string({
    required_error: 'author is required',
  }).min(3, 'author must have at least 3 characters'),
  alugado: z.boolean(),
  userId: z.string().optional(),
})

export type BookInterface = z.infer<typeof bookSchema>;