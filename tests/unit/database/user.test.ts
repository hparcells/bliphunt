import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as dotenv from 'dotenv';

import { getUserByUsername, ensureDefaultUser, tryLoginWithUsername, getUserByEmail, tryLoginWithEmail } from '../../../src/database/functions/user';

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

describe('Default User Behavior', () => {
  it('creates a default user', async () => {
    const created = await ensureDefaultUser();
    const user = await getUserByUsername('default123');

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
  it('does not create the default user if it esists', async () => {
    // Create the first user.
    const createdFirst = await ensureDefaultUser();
    expect(createdFirst).toBe(true);

    // Try to create the user again.
    const createdSecond = await ensureDefaultUser();
    expect(createdSecond).toBe(false);
  });
});

describe('User Fetch', () => {
  it('gets a user from the database by their username', async () => {
    await ensureDefaultUser();
    const user = await getUserByUsername('default123');

    expect(user).not.toBeNull();
  });
  it('returns null when getting a user by a username that doens\'t exist', async () => {
    const user = await getUserByUsername('default123');

    expect(user).toBeNull();
  });
  it('gets a user from the database by their email', async () => {
    await ensureDefaultUser();
    const user = await getUserByEmail('default@example.com');

    expect(user).not.toBeNull();
  });
  it('returns null when getting a user by an email that doens\'t exist', async () => {
    const user = await getUserByEmail('notdefault@notexample.net');

    expect(user).toBeNull();
  });
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
