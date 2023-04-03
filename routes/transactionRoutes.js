import { Router } from 'express';
import authController from '../controllers/authController.js';
import transactionController from '../controllers/transactionController.js';

const router = Router({ mergeParams: true });

router.use(authController.protect);

router.get(
  '/count',
  transactionController.setUserTransactionId,
  transactionController.countTransactions
);

router
  .route('/')
  .get(transactionController.getAllTransactions)
  .post(
    transactionController.setUserTransactionId,
    transactionController.createTransaction
  );

router
  .route('/:id')
  .get(transactionController.getTransaction)
  .patch(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

export default router;
