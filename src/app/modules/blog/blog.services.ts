import jwt from 'jsonwebtoken';
import config from '../../config';
import { Blog } from './blog.model';
import { TBlog } from './blog.interface';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { TAuthorizedData } from '../../generalType/authorizedData';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import { BlogSearchableFields } from './blog.constants';
const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find(), query)
    .search(BlogSearchableFields)
    .sort()
    .fields();

  const result = await blogQuery.filter(); // Await the filter method to get the results
  return result;
  // return result;
};

const createABlogIntoDB = async (payload: TBlog, header: any) => {
  try {
    let gotToken;

    if (header && header.startsWith('Bearer ')) {
      const bearer = header.split(' ');
      gotToken = bearer[1];
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Authorization header is missing or malformed',
      );
    }

    const authorizedData: TAuthorizedData = await new Promise(
      (resolve, reject) => {
        jwt.verify(
          gotToken,
          config.PRIVATE_KEY as string,
          (err: any, decoded: any) => {
            if (err) {
              reject(new AppError(httpStatus.BAD_REQUEST, 'Invalid token'));
            } else {
              resolve(decoded);
            }
          },
        );
      },
    );
    const { email, role, isBlocked } = authorizedData;
    try {
      if (!isBlocked) {
        const newBlog = await Blog.create({
          ...payload,
          owner: { email: email, role: role },
        });
        return { _id: newBlog._id, author: authorizedData };
      }
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create blog');
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};
const updateABlogFromDB = async (
  payload: TBlog,
  header: any,
  blogID: string,
) => {
  try {
    let gotToken;

    if (header && header.startsWith('Bearer ')) {
      const bearer = header.split(' ');
      gotToken = bearer[1];
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Authorization header is missing or malformed',
      );
    }

    const authorizedData: TAuthorizedData = await new Promise(
      (resolve, reject) => {
        jwt.verify(
          gotToken,
          config.PRIVATE_KEY as string,
          (err: any, decoded: any) => {
            if (err) {
              reject(new AppError(httpStatus.BAD_REQUEST, 'Invalid token'));
            } else {
              resolve(decoded);
            }
          },
        );
      },
    );

    const retrievedBlog = await Blog.findOne({ _id: blogID });
    if (authorizedData?.email === retrievedBlog?.owner?.email) {
      const updatedBlog = await Blog.findOneAndUpdate({ _id: blogID }, payload);
      return updatedBlog;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};
const deleteABlogFromDB = async (header: any, blogID: string) => {
  try {
    let gotToken;

    if (header && header.startsWith('Bearer ')) {
      const bearer = header.split(' ');
      gotToken = bearer[1];
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Authorization header is missing or malformed',
      );
    }

    const authorizedData: TAuthorizedData = await new Promise(
      (resolve, reject) => {
        jwt.verify(
          gotToken,
          config.PRIVATE_KEY as string,
          (err: any, decoded: any) => {
            if (err) {
              reject(new AppError(httpStatus.BAD_REQUEST, 'Invalid token'));
            } else {
              resolve(decoded);
            }
          },
        );
      },
    );

    const retrievedBlog = await Blog.findOne({ _id: blogID });
    if (
      authorizedData?.email === retrievedBlog?.owner?.email ||
      authorizedData?.role === 'admin'
    ) {
      const updatedBlog = await Blog.findOneAndDelete({ _id: blogID });
      return updatedBlog;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};

export const blogServices = {
  createABlogIntoDB,
  updateABlogFromDB,
  deleteABlogFromDB,
  getAllBlogsFromDB,
};
