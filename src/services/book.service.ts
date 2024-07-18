import { QueryCommandInput, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { DynamoTable } from '../infrastructure/dynamodb.table';
import { BookDefinition } from 'src/model/bookdefinition';
import BookInterface from 'src/model/interface/bookInterface';
import { S3SignedUrlOperation } from 'src/infrastructure/interface/s3-interface';
import { DynamoTableInterface } from 'src/infrastructure/interface/dynamo-interface';
import { BookServiceInterface } from './interface/bookServiceInterface';
interface returnFile {
  status: boolean;
  data: string;
}

export class BookService implements BookServiceInterface{
  table: DynamoTableInterface;
  public constructor(table: DynamoTableInterface){
    this.table = table;
  }
  public  createBook = async (user: BookInterface) : Promise<boolean> => {
    const bookDefinition = BookDefinition.manufacture(user);
    return await this.table.putItem(bookDefinition);
  }
  public getBook = async (pk: string, sk: string) : Promise<BookInterface> => {
    const user = await this.table.getItem(pk, sk);
    return user as BookInterface;
  }
  public updateBook = async (updtBook: BookDefinition) : Promise<boolean> => {
    const updateParams: Partial<UpdateCommandInput> = {
      Key: {
        pk: updtBook.pk,
        sk: updtBook.sk
      },
      ExpressionAttributeNames: {
        '#alugado': 'alugado',
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':alugado': updtBook.alugado,
        ':userId': updtBook.userId
      },
      UpdateExpression: 'set #alugado = :alugado, #userId = :userId'
    }
    const result = await this.table.updateItem(updateParams);
    return result;
  }

}