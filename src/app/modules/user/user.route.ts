import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userSchema } from './user.validation';
const router = express.Router();

router.post(
  '/register',
  validateRequest(userSchema.userCreationSchema),
  UserControllers.registerUser,
);
router.post(
  '/login',
  validateRequest(userSchema.userLoginSchema),
  UserControllers.loginUser,
);
router.get(
  '/users',

  UserControllers.getAllUser,
);
router.post(
  '/users/:userId/block',

  UserControllers.blockUser,
);

export const UserRoutes = router;
