import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { S3BucketInterface, S3SignedUrlOperation } from './interface/s3-interface';

export class S3Bucket implements S3BucketInterface{
  constructor(readonly bucketName: string, 
    readonly bucket = new S3Client({region: 'us-east-1'})
  ) {}
  async presigner(
    key: string,
    operation: S3SignedUrlOperation,
  ): Promise<string> {
    const time = 3600;

    if (operation === S3SignedUrlOperation.putObject) {
      const command = new PutObjectCommand({
        Key: key,
        Bucket: this.bucketName,
      });
      return await getSignedUrl(this.bucket, command, {
        expiresIn: time,
      });
    } else {
      const command = new GetObjectCommand({
        Key: key,
        Bucket: this.bucketName,
      });
      return await getSignedUrl(this.bucket, command, {
        expiresIn: time,
      });
    }
  }

  async deleteObject(key: string): Promise<DeleteObjectCommandOutput> {
    const input = {
      Bucket: this.bucketName,
      Key: key,
    };
    const command = new DeleteObjectCommand(input);
    const result = await this.bucket.send(command);
    return result;
  }

  async getObject(key: string, encoding = 'binary'): Promise<string> {
    const input = {
      Bucket: this.bucketName,
      Key: key,
    };
    const command = new GetObjectCommand(input);
    const result = await this.bucket.send(command);
    return result.Body.transformToString(encoding);
  }

  async getItem(key: string){
    const command = new GetObjectCommand({
      Key: key,
      Bucket: this.bucketName,
    });
    const response = await this.bucket.send(command);
    if (!response.Body) throw new Error('File not found');
    return response.Body.transformToString();
  }

  async getItemBuffer(key: string): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Key: key,
      Bucket: this.bucketName,
    });
    const response = await this.bucket.send(command);
    if (!response.Body) throw new Error('File not found');
    return response;
  }

  async putObject(key: string, body: Buffer): Promise<PutCommandOutput> {
    const input = {
      Body: body,
      Bucket: this.bucketName,
      Key: key,
    };
    const command = new PutObjectCommand(input);
    const result = await this.bucket.send(command);
    return result;
  }

  async uploadFile(file: Buffer, key: string) {
    try {
      const params: PutObjectCommandInput = {
        Bucket: this.bucketName,
        Key: key,
        Body: file,
      };
      await this.bucket.send(new PutObjectCommand(params));
      return { status: true, data: "the file was uploaded" };
    } catch (err) {
      return { status: false, message: err.message };
    }
  }
  async listFiles(prefix: string): Promise<ListObjectsCommandOutput> {
    const input = {
      Bucket: this.bucketName,
      Prefix: prefix,
    };
    const command = new ListObjectsCommand(input);
    const result = await this.bucket.send(command);
    return result;
  }

  async getFileSize(key: string): Promise<HeadObjectCommandOutput> {
    const input = {
      Bucket: this.bucketName,
      Key: key,
    };
    const command = new HeadObjectCommand(input);
    const result = await this.bucket.send(command);
    return result;
  }

  async deleteFolder(directory: string) {
    const listedObjects = await this.listFiles(directory);
    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: this.bucketName,
      Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    await this.deleteObject(deleteParams.Delete.Objects[0].Key);

    if (listedObjects.IsTruncated) await this.deleteFolder(directory);
  }
}
