import { z } from 'zod';
export const userSchema = z.object({
  pk: z.string({
    required_error: 'pk is required',
  }).refine(value => value.length === 11 || value.length === 14, {
    message: 'pk is a document and if the user is person must have 11 characters or if the user is a enterprise must have 14 characters',
  }),
  sk: z.string({
    required_error:'sk is required',
  }).min(3, 'sk must have at least 3 characters'),
  nomeOuRazaoSocial: z.string({
    required_error: 'nomeOuRazaoSocial is required',
  }).min(3, 'nomeOuRazaoSocial must have at least 3 characters'),
  dataDeInicioOuNascimento: z.string({
    required_error: 'dataDeInicioOuNascimento is required',
  }).date(),
  enderecos: z.array(z.string(),{
    required_error: 'enderecos is required',
  }),
  telefones: z.array(z.number().min(8, 'telefone must have at least 8 numbers'),{
    required_error: 'telefones is required',
  }),
})

export type UserInterface = z.infer<typeof userSchema>;