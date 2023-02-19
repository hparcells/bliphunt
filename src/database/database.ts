import mongoose, { Connection, ConnectOptions, Mongoose } from 'mongoose';
import * as dotenv from 'dotenv';

import { databaseLog } from '../util/log';

dotenv.config();

// TODO: Type this.
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    connection: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

const isDevelopment = process.env.NODE_ENV === 'development';
const databaseUrl = `mongodb://${process.env.DATABASE_USERNAME}:${encodeURIComponent(
  process.env.DATABASE_PASSWORD as string
)}@${
  isDevelopment ? process.env.DATABASE_DEVELOPMENT_HOST : process.env.DATABASE_PRODUCTION_HOST
}:${process.env.DATABASE_PORT}`;

// Dismiss deprecation warning.
mongoose.set('strictQuery', false);

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

export async function connect() {
  if (!process.env.DATABASE_PASSWORD) {
    throw new Error('No database password provided.');
  }

  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const connectionOptions: ConnectOptions = {
      dbName: process.env.DATABASE_NAME
    };
    cached.promise = mongoose.connect(databaseUrl, connectionOptions);
  }

  try {
    cached.connection = await cached.promise;

    databaseLog('Cached connection.');
  } catch (error) {
    throw error;
  }

  return cached.connection;
}
