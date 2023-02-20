import mongoose, { ConnectOptions, Mongoose } from 'mongoose';
import * as dotenv from 'dotenv';

import { databaseLog } from '../util/log';

dotenv.config();

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    connection: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

// Database setup.
const isDevelopment = process.env.NODE_ENV === 'development';
const databaseUrl = `mongodb://${process.env.DATABASE_USERNAME}:${encodeURIComponent(
  process.env.DATABASE_PASSWORD as string
)}@${
  isDevelopment ? process.env.DATABASE_DEVELOPMENT_HOST : process.env.DATABASE_PRODUCTION_HOST
}:${process.env.DATABASE_PORT}`;

// Dismiss deprecation warning.
mongoose.set('strictQuery', false);

// Cached connection.
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

export async function connect() {
  if (!process.env.DATABASE_PASSWORD) {
    throw new Error('No database password provided.');
  }

  // Return the cached connection if it exists already.
  if (cached.connection) {
    return cached.connection;
  }

  // Create a new promise if it doesn't exist.
  if (!cached.promise) {
    const connectionOptions: ConnectOptions = {
      dbName: process.env.DATABASE_NAME
    };
    cached.promise = mongoose.connect(databaseUrl, connectionOptions);
  }

  try {
    // Try to connect and cache it.
    cached.connection = await cached.promise;

    databaseLog('Cached connection.');
  } catch (error) {
    throw error;
  }

  return cached.connection;
}
