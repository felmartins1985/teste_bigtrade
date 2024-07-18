import {UserInterface, userSchema} from './schemas/userSchema'
import {UserUpdateInterface, userUpdateSchema} from './schemas/userUpdateSchema'
import { UserDefinition } from 'src/model/userdefinition';
import { UserService } from 'src/services/user.service';
import { Request, Response } from 'express';
import User from 'src/model/interface/userInterface';
import { DynamoTable } from 'src/infrastructure/dynamodb.table';
import { S3Bucket } from 'src/infrastructure/s3-bucket';
export interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

export class UserController{
  public userService: UserService;
  constructor(){
    const dynamoTable = new DynamoTable('felipe-lambda-crud-user-sbx-main');
    const s3Bucket = new S3Bucket('bucket-felipe');
    this.userService = new UserService(dynamoTable, s3Bucket);
  }
  public  createUser = async (req: Request, res: Response) => {
    try{
      const validate = userSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const findUser = await this.userService.getUser(validate.data.pk, validate.data.sk);
      if(findUser){
        return res.status(400).json({
          message: 'User already exists'
        })
      }
      const newUser = UserDefinition.manufacture(req.body);
      // console.log("new User------>", newUser)
      const result = await this.userService.createUser(newUser);
      res.status(200).json(result);
    }catch(error){
      console.log("=====> erro no create", error)
      res.status(400).json(error.errors);
    }
  }
  public getUser = async (req: Request, res: Response)=> {
    const { pk, sk } = req.params;
    try{
      const user = await this.userService.getUser(pk, sk);
      res.status(200).json(user);
    }catch(error){
      console.log("============> ERROR CONTROLLER  GET", error)
      res.status(400).json(error.errors);
    }
  }
  public updateUser = async (req: Request, res: Response)=>{
    try{
      const {pk, sk} = req.params;
      const findUser= await this.userService.getUser(pk, sk);
      if(!findUser){
        return res.status(404).json({
          message: 'User not found'
        })
      }
      const validate = userUpdateSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const newObject = {
        pk,
        sk,
        ...validate.data
      }
      const userUpdate = UserDefinition.manufacture(newObject as User);
      const result = await this.userService.updateUser(userUpdate);
      return res.status(200).json(result);
    }catch(error){
      console.log("============> ERROR NO UPDATE", error)
      return res.status(400).json(error.errors);
    }
  }
  public deleteUser = async (req: Request, res: Response)  => {
    try{
      const {pk, sk} = req.params;
      const findUser= await this.userService.getUser(pk, sk);
      if(!findUser){
        return res.status(404).json({
          message: 'User not found'
        })
      }
      const result = await this.userService.deleteUser({pk: pk, sk: sk});
      return res.status(200).json(result);
    }catch(error){
      console.log("============> ERROR NO DELETE", error)
      return res.status(400).json(error.errors);
    }
  }
  public uploadFile = async (req: MulterRequest, res: Response) => { 
    try{
      if (!req.files) {
        return res.status(400).json({
          message: 'No files to upload.',
        });
      }
      const file = req.files;
      const fileName = file[0].originalname;
      const buffer = file[0].buffer;
      const result = await this.userService.uploadFile(buffer, fileName);
      return res.status(200).json(result);
    }catch(error){
      console.log("============> ERROR NO UPLOAD", error)
      return res.status(400).json(error.errors);
    }
  }
  public downloadFile = async (req: Request, res: Response) => {
    try{
      const { key } = req.params;
      const result = await this.userService.downloadFile(key);
      return res.status(200).json(result);
    }catch(error){
      console.log("============> ERROR NO DOWNLOAD", error)
      return res.status(400).json(error.errors);
    }
  }
}