import BookInterface from 'src/model/interface/bookInterface';
import { BookDefinition } from 'src/model/bookdefinition';
export interface returnFile {
  status: boolean;
  data: string;
}
import { DynamoTableInterface } from 'src/infrastructure/interface/dynamo-interface';

export interface BookServiceInterface {
  table: DynamoTableInterface;
  createBook(book: BookInterface): Promise<boolean>;
  getBook(id: string, sk: string): Promise<BookInterface>;
  updateBook(updtBook: BookDefinition): Promise<boolean>;
}