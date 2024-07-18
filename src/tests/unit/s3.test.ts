import { S3Bucket } from 'src/infrastructure/s3-bucket';
import { S3SignedUrlOperation } from 'src/infrastructure/interface/s3-interface';
import { DeleteObjectCommandOutput } from '@aws-sdk/client-s3';

describe('S3Bucket', () => {
  let s3Bucket: S3Bucket;
  s3Bucket = new S3Bucket('bucket-felipe');
  beforeEach(() => {
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return a signed URL for a putObject operation', async () => {
    const key = 'test.txt';
    const operation = S3SignedUrlOperation.putObject;
    const presignerSpy = jest.spyOn(s3Bucket, 'presigner').mockResolvedValue('signedUrlPut');
    const result = await s3Bucket.presigner(key, operation);
    expect(presignerSpy).toHaveBeenCalledWith(key, operation);
    expect(result).toBe('signedUrlPut');
  });

  it('should return a signed URL for a getObject operation', async () => {
    const key = 'test.txt';
    const operation = S3SignedUrlOperation.getObject;
    const presignerSpy = jest.spyOn(s3Bucket, 'presigner').mockResolvedValue('signedUrlGet');
    const result = await s3Bucket.presigner(key, operation);
    expect(presignerSpy).toHaveBeenCalledWith(key, operation);
    expect(result).toBe('signedUrlGet');
  });

  it('should return a string if getObject is successful', async () => {
    const key = 'test.txt';
    const getObjectSpy = jest.spyOn(s3Bucket, 'getObject').mockResolvedValue('objectContent');
    const result = await s3Bucket.getObject(key);
    expect(getObjectSpy).toHaveBeenCalledWith(key);
    expect(result).toBe('objectContent');
  });

  it('should return a string if getItem is successful', async () => {
    const key = 'test.txt';
    const getItemSpy = jest.spyOn(s3Bucket, 'getItem').mockResolvedValue('itemContent');
    const result = await s3Bucket.getItem(key);
    expect(getItemSpy).toHaveBeenCalledWith(key);
    expect(result).toBe('itemContent');
  });

  it('should return a DeleteObjectCommandOutput if deleteObject is successful', async () => {
    const key = 'test.txt';
    const deleteObjectSpy = jest.spyOn(s3Bucket, 'deleteObject').mockResolvedValue({ $metadata: { httpStatusCode: 200 } });
    const result = await s3Bucket.deleteObject(key);
    expect(deleteObjectSpy).toHaveBeenCalledWith(key);
    expect(result).toStrictEqual({ $metadata: { httpStatusCode: 200 } });
  });
  it('should return an afirmative string if the uploadFile is successful', async () => {
    const file = Buffer.from('test');
    const fileName = 'test.txt';
    const uploadFileSpy = jest.spyOn(s3Bucket, 'uploadFile').mockResolvedValue({ status: true, data: 'fileUploaded' });
    const result = await s3Bucket.uploadFile(file, fileName);
    expect(uploadFileSpy).toHaveBeenCalledWith(file, fileName);
    expect(result).toStrictEqual({ status: true, data: 'fileUploaded' });
  })
  it('should return an error string if the uploadFile is unsuccessful', async () => {
    const file = Buffer.from('test');
    const fileName = 'test.txt';
    const uploadFileSpy = jest.spyOn(s3Bucket, 'uploadFile').mockResolvedValue({ status: false, data: 'Error uploading file' });
    const result = await s3Bucket.uploadFile(file, fileName);
    expect(uploadFileSpy).toHaveBeenCalledWith(file, fileName);
    expect(result).toStrictEqual({ status: false, data: 'Error uploading file' });
  })
});