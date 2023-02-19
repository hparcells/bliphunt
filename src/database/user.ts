import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { IUser, User } from '../types/user';

/**
 * Gets a user from the database.
 * @param username The username to get the user for.
 * @returns The user. `null` if the user doesn't exist.
 */
export async function getUser(username: string): Promise<IUser | null> {
  return await User.findOne({ username });
}

/**
 * Creates the default user in the database if it doesn't exist.
 */
export async function ensureDefaultUser(): Promise<void> {
  if (!(await getUser(process.env.DEFAULT_ACCOUNT_USERNAME as string))) {
    const user = new User({
      id: uuidv4(),
      username: process.env.DEFAULT_ACCOUNT_USERNAME,
      email: 'default@example.com',
      password: await bcrypt.hash(process.env.DEFAULT_ACCOUNT_PASSWORD as string, 12),
      apiKey: crypto.randomBytes(32).toString('hex'),
      createdAt: new Date()
    });
    await user.save();
  }
}

/**
 * Tries to authenticate a user.
 * @param username The username provided.
 * @param password The password provided.
 * @returns `true` if thh login was successful, `false` otherwise.
 */
export async function tryLogin(username: string, password: string): Promise<boolean> {
  const user = await getUser(username);
  if (!user) {
    return false;
  }
  return await bcrypt.compare(password, user?.password as string);
}

/**
 * Get's a user's API key.
 * @param username The username to get the API key for.
 * @returns The API key of the user.
 */
export async function getApiKey(username: string): Promise<string | null> {
  const user = await getUser(username);
  if (!user) {
    return null;
  }
  return user.apiKey;
}
