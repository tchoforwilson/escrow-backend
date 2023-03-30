import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Provide transaction title'],
  },
  role: {
    type: String,
    required: [true, 'Please provide transaction role'],
    enum: {
      values: ['Seller', 'Buyer', 'Broker'],
      message: 'You are either Buyer, Seller or Broker',
    },
  },
  inspectionDays: {
    type: Number,
    required: [true, 'Please provide inspection days for transaction'],
  },
  item: {
    name: {
      type: String,
      required: [true, 'Please provide item name'],
    },
    category: {
      type: String,
      required: [true, 'Item must belong to a category'],
      enum: {
        values: ['Vehicle', 'Electronics', 'Clothes', 'Shoes', 'Kitchen Items'],
        message: 'Please select item category',
      },
    },
    price: {
      type: Number,
      required: [true, 'Item must have a price'],
    },
    description: {
      type: String,
      required: [true, 'Item must have a description'],
    },
  },
  currency: {
    type: String,
    required: [true, 'Please provide transaction currency'],
    enum: ['XAF', 'CAD', 'USD', 'Euro', 'Niara', 'Rand'],
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
});

transactionSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name email',
  });
});

const Transaction = model('Transaction', transactionSchema);

export default Transaction;
