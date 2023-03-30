import { config } from 'dotenv';
import mongoose from 'mongoose';

// Throw uncaught exception before app begins to run
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

config({ path: './config.env' });
import app from './app.js';

// Connect to database
let DATABASE = process.env.DATABASE_LOCAL;
if (process.env.NODE_ENV === 'production') DATABASE = process.env.DATABASE_HOST;
if (process.env.NODE_ENV === 'test') DATABASE = process.env.DATABASE_TEST;

mongoose
  .connect(DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connection successfull....');
  })
  .catch((err) => {
    console.log('Unable to connect to database:💥 ', err.message);
  });
// Launch server
const port = process.env.PORT || 9000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

// Throw unhandled rejection after app runs
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
