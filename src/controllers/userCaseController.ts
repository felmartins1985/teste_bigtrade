import {BookInterface,bookSchema} from './schemas/bookSchema'
import {UserCaseInterface, userCaseSchema} from './schemas/userCaseSchema'
import { BookDefinition } from 'src/model/bookdefinition';
import { BookService } from 'src/services/book.service';
import { Request, Response } from 'express';
import Book from 'src/model/interface/bookInterface';
import { DynamoTable } from 'src/infrastructure/dynamodb.table';
import {UserInterface, userSchema} from './schemas/userSchema'
import {UserUpdateInterface, userUpdateSchema} from './schemas/userUpdateSchema'
import { UserDefinition } from 'src/model/userdefinition';
import { UserService } from 'src/services/user.service';
import User from 'src/model/interface/userInterface';
import { S3Bucket } from 'src/infrastructure/s3-bucket';
import { UserServiceInterface } from 'src/services/interface/userServiceInterface';
import { BookServiceInterface } from 'src/services/interface/bookServiceInterface';

export class UserCaseController{
  public userService: UserService;
  public bookService: BookService;
  constructor(){
    const dynamoTableUser = new DynamoTable('felipe-lambda-crud-user-sbx-main');
    const s3Bucket = new S3Bucket('bucket-felipe');
    const dynamoTableBook = new DynamoTable('felipe-crud-book');
    this.userService = new UserService(dynamoTableUser, s3Bucket);
    this.bookService = new BookService(dynamoTableBook);
  }
  public takeABook = async (req: Request, res: Response) => {
    try{
      let book;
      let user;
      const validate = userCaseSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const verify = await checkUserBookToGet(validate.data.pkUser, 
        validate.data.skUser, validate.data.pkBook,
        validate.data.skBook, this.userService.getUser, 
        this.bookService.getBook);

      if(verify.data){
        return res.status(400).json({
          message: verify.data
        })
      }
      book = verify.book;
      user = verify.user;
      const bookId = `${book.pk}/${book.sk}`;
      const userId = `${user.pk}/${user.sk}`;
      const resultUser = await updateUserGet(user, bookId, UserDefinition, this.userService);
      const resultBook = await updateBookGet(book, userId, BookDefinition, this.bookService);
      const combine ={resultUser, resultBook}
      return res.status(200).json(combine);
    }catch(error){
      console.log("=====> erro no take a book", error)
      res.status(400).json(error.errors);
    }
      
  }
  public returnABook = async (req: Request, res: Response) => {
    try{
      let book;
      let user;
      const validate = userCaseSchema.safeParse(req.body);
      if(validate.success === false){
        return res.status(400).json({
          errors: validate.error.errors.map(err => ({
            message: err.message,
            path: err.path.join(','),
          })),
        });
      }
      const verify = await checkUserBookToReturn(validate.data.pkUser, 
        validate.data.skUser, validate.data.pkBook,
        validate.data.skBook, this.userService.getUser, 
        this.bookService.getBook);
      if(verify.data){
        return res.status(400).json({
          message: verify.data
        })
      }
      book = verify.book;
      user = verify.user;
      const resultUser = await updateUserReturn(user, UserDefinition, this.userService);
      const resultBook = await updateBookReturn(book, BookDefinition, this.bookService);
      const combine ={resultUser, resultBook}
      return res.status(200).json(combine);
    } catch(error){
      console.log("=====> erro no return a book", error)
      res.status(400).json(error.errors);
    }

    }
}



//////// funcoes auxiliares//////////////////////////////////////////////////////////////
const checkUserBookToGet = async (pkUser: string, skUser: string, pkBook: string, skBook: string, getUser: any, getBook: any) => {
  const user = await getUser(pkUser, skUser);
  console.log('user=====> dentro da funcao secundaria', user)
  if(!user){
    return {
      data: 'User not found'
    }
  }
  if(user.bookId && user.bookId.length > 0){
    return {
      data: 'User already has take a book'
    }
  }
  const book = await getBook(pkBook, skBook);
  if(!book){
    return {
      data: 'Book not found'
    }
  }
  if(book.alugado){
    return {
      data: 'Book already rented'
    }
  }
  return {user, book}
}
const checkUserBookToReturn = async (pkUser: string, skUser: string, pkBook: string, skBook: string, getUser: any, getBook: any) => {
  const user = await getUser(pkUser, skUser);
  if(!user){
    return {
      data: 'User not found'
    }
  }
  if(!user.bookId || user.bookId.length < 1){
    return {
      data: 'User has not a book to return'
    }
  }
  const checkBookId =`${pkBook}/${skBook}`;
  const book = await getBook(pkBook, skBook);
  if(!book){
    return {
      data: 'Book not found'
    }
  }
  if(book.alugado === false){
    return {
      data: 'the Book is not rented'
    }
  }
  if(user.bookId !== checkBookId){
    return {
      data: 'User has not this book'
    }
  }
  return {user, book}
}


const updateUserGet= async (user: User, bookId: string, UserDefinition: any, userService: UserServiceInterface): Promise<boolean> => {
  const newUser = {
    ...user,
    bookId: bookId
  }
  const userUpdate = UserDefinition.manufacture(newUser);
  const resultUser = await userService.updateUser(userUpdate);
  return resultUser;
}

const updateBookGet= async (book: Book, userId: string, BookDefinition: any, bookService: BookServiceInterface): Promise<boolean> => {
  const newBook = {
    ...book,
    userId: userId,
    alugado: true
  }
  const bookUpdate = BookDefinition.manufacture(newBook);
  const resultBook = await bookService.updateBook(bookUpdate);
  return resultBook;
}

const updateUserReturn = async (user: User, UserDefinition, userService: UserServiceInterface): Promise<boolean> => {
  const newUser = {
    ...user,
    bookId: ''
  }
  const userUpdate = UserDefinition.manufacture(newUser);
  const resultUser = await userService.updateUser(userUpdate);
  return resultUser;
}
const updateBookReturn = async (book: Book, UserDefinition: any, bookService: BookServiceInterface): Promise<boolean> => {
  const newBook = {
    ...book,
    userId: '',
    alugado: false
  }
  const bookUpdate = BookDefinition.manufacture(newBook);
  const resultBook = await bookService.updateBook(bookUpdate);
  return resultBook;
}
// const user = await this.userService.getUser(validate.data.pkUser, validate.data.skUser);
//       if(!user){
//         return res.status(404).json({
//           message: 'User not found'
//         })
//       }
//       if(user.bookId.length > 0){
//         return res.status(400).json({
//           message: 'User already has 3 books'
//         })
//       }
//       const book = await this.bookService.getBook(validate.data.pkBook, validate.data.skBook);
//       if(!book){
//         return res.status(404).json({
//           message: 'Book not found'
//         })
//       }
//       if(book.alugado){
//         return res.status(400).json({
//           message: 'Book already rented'
//         })
//       }