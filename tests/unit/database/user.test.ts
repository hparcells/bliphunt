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
  it('Default user is created.', async () => {
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
  it('Default user is not created if it exists.', async () => {
    // Create the first user.
    const createdFirst = await ensureDefaultUser();
    expect(createdFirst).toBe(true);

    // Try to create the user again.
    const createdSecond = await ensureDefaultUser();
    expect(createdSecond).toBe(false);
  });
});

describe('User Fetch', () => {
  it('Gets a user by their username from the database.', async () => {
    await ensureDefaultUser();
    const user = await getUserByUsername('default123');

    expect(user).not.toBeNull();
  });
  it('Getting a user by their username that doesn\'t exist returns null.', async () => {
    const user = await getUserByUsername('default123');

    expect(user).toBeNull();
  });
  it('Gets a user by their email from the database.', async () => {
    await ensureDefaultUser();
    const user = await getUserByEmail('default@example.com');

    expect(user).not.toBeNull();
  });
  it('Getting a user by their email that doesn\'t exist returns null.', async () => {
    const user = await getUserByEmail('notdefault@notexample.net');

    expect(user).toBeNull();
  });
});
describe('User Authentication with Username', () => {
  it('Successful login.', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithUsername('default123', 'default123');
    
    expect(success).not.toBeNull();
    // TODO: Add more conditions.
  });
  it('Failed login with a username that doens\'t exist returns null.', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithUsername('default123456', 'default123456');

    expect(success).toBe(null);
  });
  it('Failed login with a wrong password returns null.', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithUsername('default123', 'default123456');

    expect(success).toBe(null);
  });
});
describe('User Authentication with Email', () => {
  it('Successful login.', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithEmail('default@example.com', 'default123');
    
    expect(success).not.toBeNull();
    // TODO: Add more conditions.
  });
  it('Failed login with an email that doens\'t exist returns null.', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithEmail('notdefault@notexample.net', 'default123456');

    expect(success).toBe(null);
  });
  it('Failed login with a wrong password returns null.', async () => {
    await ensureDefaultUser();
    const success = await tryLoginWithEmail('default@example.com', 'default123456');

    expect(success).toBe(null);
  });
});