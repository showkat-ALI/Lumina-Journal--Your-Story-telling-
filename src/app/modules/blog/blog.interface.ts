import { ObjectId } from 'mongoose';

export type TBlog = {
  title: string;
  content: string;
  isPublished: boolean;
  isDeleted: boolean;
  _id: ObjectId;
};
