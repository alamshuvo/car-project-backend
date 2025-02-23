/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import seedAdmin from './app/DB';

let server: Server;

const gracefulShutdown = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      mongoose.connection.close(false).then(() => {
        console.log('MongoDB connection closed');
        process.exit(1);
      });
    });
  } else {
    process.exit(1);
  }
};

const main = async () => {
  try {
    // connect to db
    await mongoose.connect(config.database_uri as string);
    console.log('Connected to MongoDB');

    // seed admin if no admin
    await seedAdmin();

    server = app.listen(config.port, () => {
      console.log(
        `CarStore Backend running on http://localhost:${config.port}`,
      );
    });
  } catch (error) {
    console.log('Error starting server:', error);
    process.exit(1);
  }
};
main();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown();
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  gracefulShutdown();
});

// Handle SIGINT signal
process.on('SIGINT', () => {
  console.log('SIGINT received');
  gracefulShutdown();
});
