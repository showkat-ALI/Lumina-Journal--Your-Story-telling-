import { Model, ObjectId } from 'mongoose';
type Owner = {
  email: string;
  role: string;
};
export type TBlog = {
  title: string;
  content: string;
  isPublished: boolean;
  isDeleted: boolean;
  _id: ObjectId;
  owner: Owner;
};
export interface BlogModel extends Model<TBlog> {
  isBlogExists(id: string): Promise<TBlog | null>;
}
