export default interface User {
  pk: string;
  sk: string;
  nomeOuRazaoSocial: string;
  dataDeInicioOuNascimento: string;
  enderecos: string[];
  telefones: number[];
  bookId?: string;
}