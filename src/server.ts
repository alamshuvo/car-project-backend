/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import seedAdmin from './app/DB';
let server: Server;
const main = async () => {
  try {
    // connect to db
    await mongoose.connect(config.database_uri as string);
    // seed admin if no admin
    await seedAdmin();
    app.listen(config.port, () => {
      console.log(
        `CarStore Backend running on http://localhost:${config.port}`,
      );
    });
  } catch (error) {
    console.log(error);
  }
};

main();

//* if any unhandledRejection or uncaughtException error occurs the server will stop
process.on('unhandledRejection', () => {
  // console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
