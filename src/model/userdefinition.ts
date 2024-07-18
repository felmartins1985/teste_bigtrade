import UserInterface from 'src/model/interface/userInterface';
import crypto, { randomUUID } from 'crypto';
randomUUID();
export class UserDefinition{
  readonly pk: string;
  readonly sk: string;
  readonly nomeOuRazaoSocial: string;
  readonly dataDeInicioOuNascimento: string;
  readonly enderecos: string[];
  readonly telefones: number[];
  readonly bookId?: string;
  constructor(user: UserInterface){
    this.pk = user.pk;
    this.sk = user.sk;
    this.nomeOuRazaoSocial = user.nomeOuRazaoSocial;
    this.dataDeInicioOuNascimento = user.dataDeInicioOuNascimento;
    this.enderecos = user.enderecos;
    this.telefones = user.telefones;
    this.bookId = user.bookId ?? '';
  } 
  static manufacture(user: UserInterface): UserDefinition{
    return new UserDefinition(user);
  }
}