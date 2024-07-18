import { Request, Response, Router } from 'express';
import { UserController, MulterRequest } from 'src/controllers/userController';
import { BookController } from 'src/controllers/bookController';
import { UserCaseController } from 'src/controllers/userCaseController';
import multer from 'multer';
const routes = Router();
const fileSize = 5 * 1024 * 1024;
const multerMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: fileSize },
});
const userController = new UserController();
const bookController = new BookController();
const userCaseController = new UserCaseController();
routes.post('/returnABook', (req: Request, res: Response) => userCaseController.returnABook(req, res));
routes.post('/takeABook', (req: Request, res: Response) => userCaseController.takeABook(req, res));
routes.get('/book/:pk/:sk', (req: Request, res: Response) => bookController.getBook(req, res));
routes.get('/download/:key', (req: Request, res: Response) => userController.downloadFile(req, res));
routes.get('/:pk/:sk', (req: Request, res: Response) => userController.getUser(req, res));
routes.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json('Hello World!');
  } catch (error) {
    res.status(500).json({
      error: error.stack,
    });
  }
});

routes.post('/book',(req: Request, res: Response) => bookController.createBook(req, res));
routes.put('/book/:pk/:sk',(req: Request, res: Response) => bookController.updateBook(req, res));
routes.post('/',(req: Request, res: Response) => userController.createUser(req, res));
routes.post('/upload', multerMiddleware.array('images',1), (req: MulterRequest, res: Response) => userController.uploadFile(req, res));
routes.put('/:pk/:sk', (req: Request, res: Response) => userController.updateUser(req, res));
routes.delete('/:pk/:sk', (req: Request, res: Response) => userController.deleteUser(req, res));

export default routes;
