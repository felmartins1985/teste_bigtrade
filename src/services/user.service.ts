import { QueryCommandInput, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { DynamoTable } from '../infrastructure/dynamodb.table';
import { UserDefinition } from 'src/model/userdefinition';
import UserInterface from 'src/model/interface/userInterface';
import { S3SignedUrlOperation } from 'src/infrastructure/interface/s3-interface';
import {  S3Bucket } from 'src/infrastructure/s3-bucket';
import { DynamoTableInterface } from 'src/infrastructure/interface/dynamo-interface';
import {S3BucketInterface} from 'src/infrastructure/interface/s3-interface';
import { UserServiceInterface } from './interface/userServiceInterface';
interface returnFile {
  status: boolean;
  data: string;
}

// const s3 = new S3Bucket('bucket-felipe');
export class UserService implements UserServiceInterface{
  table: DynamoTableInterface;
  s3: S3BucketInterface;
  public constructor(table: DynamoTableInterface, s3: S3BucketInterface){
    this.table = table;
    this.s3 = s3;
  }
  public  createUser = async (user: UserInterface) : Promise<boolean> => {
    const userDefinition = UserDefinition.manufacture(user);
    return await this.table.putItem(userDefinition);
  }
  public getUser = async (pk: string, sk: string) : Promise<UserInterface> => {
    const user = await this.table.getItem(pk, sk);
    return user as UserInterface;
  }
  public updateUser = async (updtUser: UserDefinition) : Promise<boolean> => {
    const updateParams: Partial<UpdateCommandInput> = {
      Key: {
        pk: updtUser.pk,
        sk: updtUser.sk
      },
      ExpressionAttributeNames: {
        '#nomeOuRazaoSocial': 'nomeOuRazaoSocial',
        '#dataDeInicioOuNascimento': 'dataDeInicioOuNascimento',
        '#enderecos': 'enderecos',
        '#telefones': 'telefones',
        '#bookId': 'bookId'
      },
      ExpressionAttributeValues: {
        ':nomeOuRazaoSocial': updtUser.nomeOuRazaoSocial,
        ':dataDeInicioOuNascimento': updtUser.dataDeInicioOuNascimento,
        ':enderecos': updtUser.enderecos,
        ':telefones': updtUser.telefones,
        ':bookId': updtUser.bookId
      },
      UpdateExpression: 'set #nomeOuRazaoSocial = :nomeOuRazaoSocial, #dataDeInicioOuNascimento = :dataDeInicioOuNascimento, #enderecos = :enderecos, #telefones = :telefones, #bookId = :bookId'
    }
    const result = await this.table.updateItem(updateParams);
    return result;
  }
  public deleteUser = async (key: { pk: string; sk: string }) : Promise<boolean> => {
    return await this.table.delete(key);
  }

  public uploadFile = async (file: Buffer, fileName: string) : Promise<returnFile> => {
    const key = `image-${fileName}`;
    const result = await this.s3.uploadFile(file,key);
    if (!result) return { status: false, data: 'Error uploading file' };
    return { status: true, data: 'File uploaded successfully' };
  }

  public downloadFile = async (key: string) : Promise<returnFile>=> {
    const result = await this.s3.presigner(key,S3SignedUrlOperation.getObject);
    if (!result) return { status: false, data: 'Error downloading file' };
    return { status: true, data: result };
  }
}