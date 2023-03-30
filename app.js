import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

import globalErrorHandler from './controllers/errorController.js';
import AppError from './utilities/appError.js';
import userRouter from './routes/userRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';

config({ path: './config.env' });

// Start express app
const app = express();

// GLOBAL MIDDLEWARES
// Serving static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(json({ limit: '10kb' }));
app.use(urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/transactions', transactionRouter);

// INVALID ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
