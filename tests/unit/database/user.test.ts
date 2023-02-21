import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as dotenv from 'dotenv';

import { getUser, ensureDefaultUser, tryLogin } from '../../../src/database/functions/user';

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

describe('User Database Functions', () => {
  it('Default user is created.', async () => {
    const created = await ensureDefaultUser();
    const user = await getUser('default123');

    // Check if everything is created.
    expect(user).not.toBeNull();
    expect(typeof user?.id).toBe('string');
    expect(user?.username).toBe('default123');
    expect(user?.email).toBe('default@example.com');
    expect(typeof user?.password).toBe('string');
    expect(typeof user?.apiKey).toBe('string');
    expect(user?.createdAt).toBeInstanceOf(Date);

    // Function should return true if the account is created.
    expect(created).toBe(true);
  });
  it('Default user is not created if it exists.', async () => {
    // Create the first user.
    const createdFirst = await ensureDefaultUser();
    expect(createdFirst).toBe(true);

    // Try to create the user again.
    const createdSecond = await ensureDefaultUser();
    expect(createdSecond).toBe(false);
  });
  it('Gets a user from the database.', async () => {
    await ensureDefaultUser();
    const user = await getUser('default123');

    expect(user).not.toBeNull();
  });
  it('Getting a user that doesn\'t exist returns null.', async () => {
    const user = await getUser('default123');

    expect(user).toBeNull();
  });
  it('Successful login.', async () => {
    await ensureDefaultUser();
    const success = await tryLogin('default123', 'default123');
    
    expect(success).not.toBeNull();
    // TODO: Add more conditions.
  });
  it('Failed login with a user that doens\'t exist.', async () => {
    await ensureDefaultUser();
    const success = await tryLogin('default123456', 'default123456');

    expect(success).toBe(null);
  });
  it('Failed login with a wrong password.', async () => {
    await ensureDefaultUser();
    const success = await tryLogin('default123', 'default123456');

    expect(success).toBe(null);
  });
});
