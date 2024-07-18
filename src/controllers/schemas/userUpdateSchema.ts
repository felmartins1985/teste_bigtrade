import { z } from 'zod';
export const userUpdateSchema = z.object({
  nomeOuRazaoSocial: z.string({
    required_error: 'name is required',
  }).min(3, 'name must have at least 3 characters'),
  dataDeInicioOuNascimento: z.string({
    required_error: 'dataDeInicioOuNascimento is required',
  }).date(),
  enderecos: z.array(z.string(),{
    required_error: 'enderecos is required',
  }),
  telefones: z.array(z.number(),{
    required_error: 'telefones is required',
  }),
  booksId: z.string().optional(),
})

export type UserUpdateInterface = z.infer<typeof userUpdateSchema>;

