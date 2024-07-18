import {
  DynamoDBDocument,
  GetCommandInput,
  QueryCommandInput,
  QueryCommandOutput,
  UpdateCommandInput,
  PutCommandOutput,
  DeleteCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { UserDefinition } from 'src/model/userdefinition';

export interface UserInterface {
  pk: string;
  sk: string;
}

export interface DynamoTableInterface{
  client: DynamoDBDocument;
  tableName: string;
  putItem(item: any): Promise<boolean>;
  delete(key: { pk: string; sk: string }): Promise<boolean>;
  updateItem(params: Partial<UpdateCommandInput>): Promise<boolean>;
  query(params: Partial<QueryCommandInput>): Promise<QueryCommandOutput>;
  getItems(pk: string): Promise<any[]>;
  getItem(pk: string, sk: string): Promise<any>;
}