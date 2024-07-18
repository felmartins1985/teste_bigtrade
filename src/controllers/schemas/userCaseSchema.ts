import { z } from 'zod';
export const userCaseSchema = z.object({
  pkUser: z.string({
    required_error: 'pkUser is required',
  }).refine(value => value.length === 11 || value.length === 14, {
    message: 'pkUser is a document and must have either 11 or 14 characters',
  }),
  skUser: z.string({
    required_error:'skUser is required',
  }).min(3,'skUser must have at least 3 characters'),
  pkBook: z.string({
    required_error: 'pkBook is required',
  }).min(5, 'pkBook must have at least 5 characters'),
  skBook: z.string({
    required_error:'skBook is required',
  }).min(3, 'skBook must have at least 3'),
})

export type UserCaseInterface = z.infer<typeof userCaseSchema>;