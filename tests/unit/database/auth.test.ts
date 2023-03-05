import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as dotenv from 'dotenv';

import { ensureDefaultUser } from '../../../src/database/functions/user';
import { tryLoginWithEmail, tryLoginWithUsername } from '../../../src/database/functions/auth'

dotenv.config();

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();

  // Dismiss deprecation warning.
  mongoose.set('strictQuery', false);

  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  // Reset.
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Stop everything.
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

describe('User Authentication with Username', () => {
  it('logs in and returns the user with correct information', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithUsername('default123', 'default123');
    
    expect(success).not.toBeNull();
    // TODO: Add more conditions.
  });
  it('returns null when logging in with a username that doesn\'t exist', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithUsername('default123456', 'default123456');

    expect(success).toBe(null);
  });
  it('returns null when logging in with an incorrect password', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithUsername('default123', 'default123456');

    expect(success).toBe(null);
  });
});

describe('User Authentication with Email', () => {
  it('logs in and returns the user with correct information', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithEmail('default@example.com', 'default123');
    
    expect(success).not.toBeNull();
    // TODO: Add more conditions.
  });
  it('returns null when logging in with an email that doesn\'t exist', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithEmail('notdefault@notexample.net', 'default123456');

    expect(success).toBe(null);
  });
  it('returns null when logging in with an incorrect password', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithEmail('default@example.com', 'default123456');

    expect(success).toBe(null);
  });
});
