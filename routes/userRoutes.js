import { Router } from 'express';
import authController from './../controllers/authController.js';
import userController from './../controllers/userController.js';
import TransactionRouter from './transactionRoutes.js';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

// Merge param with transaction
router.use('/:userId/transactions', TransactionRouter);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
