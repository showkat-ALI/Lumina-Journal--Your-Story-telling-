import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { blogSchema } from './blog.validation';
import { blogControllers } from './blog.controllers';
const router = express.Router();

router.post('', validateRequest(blogSchema), blogControllers.createABlog);
router.patch('/:id', validateRequest(blogSchema), blogControllers.updateBlog);
router.delete('/:id', blogControllers.deleteABlog);
router.get('', blogControllers.getAllBlogs);

export const blogRoutes = router;
