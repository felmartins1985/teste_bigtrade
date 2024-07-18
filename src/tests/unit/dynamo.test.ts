import { DynamoTable } from 'src/infrastructure/dynamodb.table';
import {UserInterface} from 'src/infrastructure/item'
import {
  DynamoDBDocument,
  PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import {
  DynamoDB, PutItemCommandOutput
} from '@aws-sdk/client-dynamodb';
const marshallOptions = {
  convertEmptyValues: false, // default
  removeUndefinedValues: true, // default
  convertClassInstanceToMap: true, // for data instance to be converted into object
};

const unmarshallOptions = {
  wrapNumbers: false, // default
};

const dynamoDbClient = new DynamoDB({
  region: process.env.AWS_REGION || 'us-east-1',
});

const dynamo = DynamoDBDocument.from(dynamoDbClient, {
  marshallOptions,
  unmarshallOptions,
});
const mockUser: UserInterface ={
  cpf: '12345678901',
  sk: 'USER',
  nome: 'Fulano',
  sobrenome: 'de Tal',
  dataDeNascimento: '1990-01-01',
  enderecos: ['Rua A, 123', 'Rua B, 456'],
  telefones: [123456789, 987654321],
}
jest.mock('src/infrastructure/dynamodb.table');

describe('DynamoTable', () => {
  let dynamoTable = new DynamoTable('felipe-lambda-crud-user-sbx-main');
  beforeEach(() => { });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return true if putItem is successful', async () => {
    jest.spyOn(dynamo, 'put').mockResolvedValue({} as PutCommandOutput);
    const result = await dynamoTable.putItem(mockUser);
    expect(result).toBe(true);
    expect(result).toBe(true)
  });

  it('should return true if delete is successful', async () => {
    jest.spyOn(dynamoTable, 'delete').mockResolvedValue(true);
    const key = {
      cpf: '12345678901',
      sk: 'USER',
    };
    const result = await dynamoTable.delete(key);
    expect(result).toBe(true);
   
    
  });

  it('should return true if updateItem is successful', async () => {
    jest.spyOn(dynamoTable, 'updateItem').mockResolvedValue(true);
    const params = {
      Key: {
        cpf: '12345678901',
        sk: 'USER',
      },
      UpdateExpression: 'set nome = :n',
      ExpressionAttributeValues: {
        ':n': 'Beltrano',
      },
    };
    const result = await dynamoTable.updateItem(params);
    expect(result).toBe(true);
  });

  it('should return a user if getItem is successful', async () => {
    jest.spyOn(dynamoTable, 'getItem').mockResolvedValue(mockUser);
    const cpf = '12345678901';
    const sk = 'USER';
    const result = await dynamoTable.getItem(cpf, sk);
    expect(result).toBeInstanceOf(Object);

  });
});