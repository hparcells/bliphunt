import { model, Schema, models } from 'mongoose';

export interface ISafeUser {
  id: string;
  username: string;
  email: string;
  apiKey: string;
  createdAt: Date;

  avatarFileName?: string;
  displayName?: string;
}
export interface IUser extends ISafeUser {
  password: string;
}
const userSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  apiKey: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true },

  avatarFileName: { type: String, required: false },
  displayName: { type: String, required: false }
});
export default models['User'] || model<IUser>('User', userSchema);
