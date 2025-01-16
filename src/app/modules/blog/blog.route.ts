import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { blogSchema } from './blog.validation';
import { blogControllers } from './blog.controllers';
const router = express.Router();

router.post('', validateRequest(blogSchema), blogControllers.createABlog);
router.post('/:id', validateRequest(blogSchema), blogControllers.updateBlog);

export const blogRoutes = router;
