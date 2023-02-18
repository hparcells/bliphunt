import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { User } from '../shared/types/user';

/**
 * Checks if a user exists in the database.
 * @param username The username to check.
 * @returns If a user with the username exists in the database.
 */
export async function usernameExists(username: string): Promise<boolean> {
  return (await User.findOne({ username }).countDocuments()) > 0;
}

/**
 * Creates the default user in the database if it doesn't exist.
 */
export async function ensureDefaultUser(): Promise<void> {
  if (!(await usernameExists(process.env.DEFAULT_ACCOUNT_USERNAME as string))) {
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
