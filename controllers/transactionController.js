import factory from './handlerFactory.js';
import Transaction from '../models/transactionModel.js';

const setUserTransactionId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const createTransaction = factory.createOne(Transaction);
const getTransaction = factory.getOne(Transaction);
const getAllTransactions = factory.getAll(Transaction);
const updateTransaction = factory.updateOne(Transaction);
const deleteTransaction = factory.deleteOne(Transaction);

export default {
  setUserTransactionId,
  createTransaction,
  getTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
};
