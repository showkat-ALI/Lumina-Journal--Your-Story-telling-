import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { blogServices } from './blog.services';

const createABlog = catchAsync(async (req, res) => {
  const userData = req.body;
  const header = req.headers['authorization'];

  const result = await blogServices.createABlogIntoDB(userData, header);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog is created succesSfully',
    data: result,
  });
});
const deleteABlog = catchAsync(async (req, res) => {
  const blogID = req.params.id;
  const header = req.headers['authorization'];

  await blogServices.deleteABlogFromDB(header, blogID);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog is deleted succesSfully',
    data: {},
  });
});
const updateBlog = catchAsync(async (req, res) => {
  const blogID = req.params.id;
  const userData = req.body;
  const header = req.headers['authorization'];

  const result = await blogServices.updateABlogFromDB(userData, header, blogID);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog is updated succesSfully',
    data: result,
  });
});
const getAllBlogs = catchAsync(async (req, res) => {
  const result = await blogServices.getAllBlogsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog are retrieved succesSfully',
    data: result,
  });
});

export const blogControllers = {
  createABlog,
  updateBlog,
  deleteABlog,
  getAllBlogs,
};
