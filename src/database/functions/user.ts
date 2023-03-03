import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import User, { ISafeUser, IUser } from '../../types/user';

/**
 * Gets a user from the database by their username.
 * @param username The username to get the user for.
 * @returns The user, `null` if the user doesn't exist.
 */
export async function getUserByUsername(username: string): Promise<IUser | null> {
  return await User.findOne({ username });
}

/**
 * Gets a user from the database by their email.
 * @param email The email to look for.
 * @returns The user, `null` if the user doesn't exist.
 */
export async function getUserByEmail(email: string): Promise<IUser | null> {
  return await User.findOne({ email });
}

/**
 * Creates the default user in the database if it doesn't exist.
 *
 * The default username and password are `default123`.
 *
 * @returns `true` if the user was created, `false` otherwise.
 */
export async function ensureDefaultUser(): Promise<boolean> {
  // If the user doesn't exist, create it.
  if (!(await getUserByUsername('default123'))) {
    const user = new User({
      id: uuidv4(),
      username: 'default123',
      email: 'default@example.com',
      password: await bcrypt.hash('default123', 12),
      apiKey: crypto.randomBytes(32).toString('hex'),
      createdAt: new Date()
    });
    await user.save();
    return true;
  }
  return false;
}

/**
 * Tries to login a user with their username.
 * @param username The username provided.
 * @param password The password provided.
 * @returns Returns a user object if the login was successful, `false` otherwise.
 */
export async function tryLoginWithUsername(
  username: string,
  password: string
): Promise<ISafeUser | null> {
  // Check if the user exists.
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }

  // Check if password matches.
  const success = await bcrypt.compare(password, user.password as string);
  if (!success) {
    return null;
  }

  // Don't send the password hash to the client.
  user.password = undefined as any;

  return user;
}

/**
 * Tries to login a user with their email.
 * @param username The username provided.
 * @param password The password provided.
 * @returns Returns a user object if the login was successful, `false` otherwise.
 */
export async function tryLoginWithEmail(
  email: string,
  password: string
): Promise<ISafeUser | null> {
  // Check if the user exists.
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  // Check if password matches.
  const success = await bcrypt.compare(password, user.password as string);
  if (!success) {
    return null;
  }

  // Don't send the password hash to the client.
  user.password = undefined as any;

  return user;
}

/**
 * Checks if a user's authorization is valid.
 * @param authorization The user's authorization formatted as `USERNAME@API_KEY`.
 * @returns True if the authorization is valid, false otherwise.
 */
export async function validateAuthorization(authorization: string): Promise<boolean> {
  const username = authorization.split('@')[0];
  const apiKey = authorization.split('@')[1];

  const user = await getUserByUsername(username);

  if (!user || apiKey !== user.apiKey) {
    return false;
  }
  return true;
}
