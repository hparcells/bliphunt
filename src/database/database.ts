import mongoose, { ConnectOptions } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';
const databaseUrl = `mongodb://${process.env.DATABASE_USERNAME}:${encodeURIComponent(
  process.env.DATABASE_PASSWORD as string
)}@${
  isDevelopment ? process.env.DATABASE_DEVELOPMENT_HOST : process.env.DATABASE_PRODUCTION_HOST
}:${process.env.DATABASE_PORT}`;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

async function connect() {
  if (!process.env.DATABASE_PASSWORD) {
    throw new Error('No database password provided.');
  }

  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(databaseUrl);
  }

  try {
    cached.connection = await cached.promise;
  } catch (err) {
    throw new Error('Error connecting to database.');
  }

  return cached.connection;
}

export default connect;
