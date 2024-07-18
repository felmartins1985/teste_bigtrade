import UserInterface from 'src/model/interface/userInterface';
import { UserDefinition } from 'src/model/userdefinition';
export interface returnFile {
  status: boolean;
  data: string;
}
import { DynamoTableInterface } from 'src/infrastructure/interface/dynamo-interface';
import { S3BucketInterface } from 'src/infrastructure/interface/s3-interface';
export interface UserServiceInterface {
  
  table: DynamoTableInterface;
  s3: S3BucketInterface;
  createUser(user: UserInterface): Promise<boolean>;
  getUser(documentos: string, sk: string): Promise<UserInterface>;
  updateUser(updtUser: UserDefinition): Promise<boolean>;
  deleteUser(key: { pk: string; sk: string }): Promise<boolean>;
  uploadFile(file: Buffer, fileName: string): Promise<returnFile>;
  downloadFile(key: string): Promise<returnFile>;
}