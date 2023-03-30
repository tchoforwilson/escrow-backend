import { Router } from 'express';
import authController from '../controllers/authController.js';
import transactionController from '../controllers/transactionController.js';

const router = Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(transactionController.getAllTransactions)
  .post(
    authController.restrictTo('user'),
    transactionController.setUserTransactionId,
    transactionController.createTransaction
  );

router
  .route('/:id')
  .get(transactionController.getTransaction)
  .patch(
    authController.restrictTo('user'),
    transactionController.updateTransaction
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    transactionController.deleteTransaction
  );

export default router;
