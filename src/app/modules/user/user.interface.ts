export type TUser = {
  password: string;
  role: 'admin' | 'user';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
  name: string;
  email: string;
  isBlocked: boolean;
};
