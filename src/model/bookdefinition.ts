import BookInterface from 'src/model/interface/bookInterface';
import crypto, { randomUUID } from 'crypto';
randomUUID();
export class BookDefinition{
  readonly pk: string;
  readonly sk: string;
  readonly author: string;
  readonly alugado: boolean;
  readonly userId?: string
  constructor(book: BookInterface){
    this.pk = book.pk;
    this.sk = book.sk;
    this.author = book.author;
    this.alugado = book.alugado;
    this.userId = book.userId ?? '';
  }
  static manufacture(book: BookInterface): BookDefinition{
    return new BookDefinition(book);
  }
}