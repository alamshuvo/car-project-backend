import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();

// parsers
// 'https://carstore-frontend.vercel.app'
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://car-project-flame.vercel.app'],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use('/', router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
