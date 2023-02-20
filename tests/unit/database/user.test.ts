import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as dotenv from 'dotenv';

import { getUser, ensureDefaultUser, tryLogin, getApiKey } from '../../../src/database/user';

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
    await ensureDefaultUser();
    const user = await getUser('default123');

    // Check if everything is created.
    expect(user).not.toBeNull();
    expect(typeof user?.id).toBe('string');
    expect(user?.username).toBe('default123');
    expect(user?.email).toBe('default@example.com');
    expect(typeof user?.password).toBe('string');
    expect(typeof user?.apiKey).toBe('string');
    expect(user?.createdAt).toBeInstanceOf(Date);
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

    expect(success).toBe(true);
  });
  it('Failed login.', async () => {
    await ensureDefaultUser();
    const success = await tryLogin('default123', 'default123456');

    expect(success).toBe(false);
  });
  it('Get API key works.', async () => {
    await ensureDefaultUser();
    const user = await getUser('default123');
    const fetchedApiKey = await getApiKey('default123');

    expect(fetchedApiKey).toBe(user?.apiKey);
  });
  it('Get API of a non-existing user returns null.', async () => {
    await ensureDefaultUser();
    const fetchedApiKey = await getApiKey('default123456');

    expect(fetchedApiKey).toBeNull();
  });
});
