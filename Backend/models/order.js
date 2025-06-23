import mongoose from 'mongoose';
import orderCounter from "./counter.js";
import getBTCPrice from "./cryptoService.js"; // Assuming you have a function to fetch BTC price

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    default: 'BTC-Second Contract'
  },
  openingPrice: {
    type: Number,
    required: true
  },
  closingPrice: {
    type: Number
  },
  amount: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  direction: {
    type: String,
    enum: ['up', 'down'],
    required: true
  },
  openingTime: {
    type: Date,
    required: true
  },
  closingTime: {
    type: Date,
    required: true
  },
  profitLoss: {
    type: Number
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  termCode: {
    type: Number,
    unique: true
  }
}, {
  timestamps: true
});

// Auto-increment termCode before saving
orderSchema.pre('save', async function (next) {
  const doc = this;

  if (doc.isNew) {
    try {
      const counter = await orderCounter.findByIdAndUpdate(
        { _id: 'termCode' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      if (!counter) {
        console.error('Counter document not found or created');
        return next(new Error('Counter document not found or created'));
      }

      doc.termCode = counter.seq;
      next();
    } catch (error) {
      console.error('Error incrementing termCode:', error);
      next(error);
    }
  } else {
    next();
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;