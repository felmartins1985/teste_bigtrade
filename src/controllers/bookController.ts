import {BookInterface,bookSchema} from './schemas/bookSchema'

import { BookDefinition } from 'src/model/bookdefinition';
import { BookService } from 'src/services/book.service';
import { Request, Response } from 'express';
import Book from 'src/model/interface/bookInterface';
import { DynamoTable } from 'src/infrastructure/dynamodb.table';

export class BookController{
  public bookService: BookService;
  constructor(){
    const dynamoTable = new DynamoTable('felipe-crud-book');
    this.bookService = new BookService(dynamoTable);
  }
  public  createBook = async (req: Request, res: Response) => {
    try{
      const validate = bookSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const findBook = await this.bookService.getBook(validate.data.pk, validate.data.sk);
      if(findBook){
        return res.status(400).json({
          message: 'Book already exists'
        })
      }
      const newBook = BookDefinition.manufacture(req.body);
      const result = await this.bookService.createBook(newBook);
      res.status(200).json(result);
    }catch(error){
      console.log("=====> ERROR NO CATCH DO CREATE", error)
      res.status(400).json(error.errors);
    }
  }
  public getBook = async (req: Request, res: Response)=> {
    const { pk, sk } = req.params;
    try{
      console.log("pk======>", pk)
      const nomeDecoded = decodeURIComponent(pk);
      console.log("nome decoded =====>", nomeDecoded);
      const book = await this.bookService.getBook(nomeDecoded, sk);
      res.status(200).json(book);
    }catch(error){
      console.log("============> ERROR NO CATCH DO GET", error)
      res.status(400).json(error.errors);
    }
  }
  public updateBook = async (req: Request, res: Response)=>{
    try{
      const {pk, sk} = req.params;
      const findBook= await this.bookService.getBook(pk, sk);
      if(!findBook){
        return res.status(404).json({
          message: 'Book not found'
        })
      }
      const validate = bookSchema.safeParse(req.body);
      console.log("validate data======>", validate.data);
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
      const bookUpdate = BookDefinition.manufacture(newObject as Book);
      const result = await this.bookService.updateBook(bookUpdate);
      return res.status(200).json(result);
    }catch(error){
      console.log("============> ERROR NO CATCH DO UPDATE", error)
      return res.status(400).json(error.errors);
    }
  }
}