import { Model } from 'mongoose';

export type TUser = {
  password: string;
  role: 'admin' | 'user';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
  name: string;
  email: string;
  isBlocked: boolean;
};
export interface UserModel extends Model<TUser> {
  isUserExists(id: string): Promise<TUser | null>;
}
