import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import User, { IUser } from '../../types/user';

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
 * Tries to create a user and add it to the database. Checks if there is an existing user with the username and email provided.
 * @param username The username to create.
 * @param email The email to create.
 * @param password The password associated with the account.
 * @returns `true` if the user was created, `false` otherwise.
 */
export async function createUser(
  username: string,
  email: string,
  password: string
): Promise<boolean> {
  const existingUsernameUser = await getUserByUsername(username);
  const existingEmailUser = await getUserByEmail(email);

  // If a user exists with the specified username or email already.
  if (existingUsernameUser || existingEmailUser) {
    return false;
  }

  // Create the user.
  const user = new User({
    id: uuidv4(),
    username,
    email,
    password: await bcrypt.hash(password, 12),
    apiKey: crypto.randomBytes(32).toString('hex'),
    createdAt: new Date()
  });
  await user.save();
  return true;
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
  const success = await createUser('default123', 'default@example.com', 'default123');
  return success;
}

/**
 * Deletes the default from the database.
 */
export async function deleteDefaultUser(): Promise<void> {
  await User.findOneAndRemove({ username: 'default123' });
}
