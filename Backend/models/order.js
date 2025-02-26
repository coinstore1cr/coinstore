import mongoose  from "mongoose";
import orderCounter  from "./counter.js";
import getBTCPrice from "./cryptoService.js"; // Assuming you have a function to fetch BTC price

const orderSchema = new mongoose.Schema({
  termCode: { type: Number, unique: true, required: true, default: 2025723451 }, // Auto-incremented term code
  name: { type: String, default: 'BTC-second contract' }, // Default order name
  openingPrice: { type: Number, required: true }, // Opening price of BTC
  closingPrice: { type: Number }, // Closing price (optional, updated later)
  time: { type: Number, required: true }, // Duration in seconds
  buyAmount: { type: Number, required: true }, // Amount invested
  openingTime: { type: Date, default: Date.now }, // Timestamp when order is created
  closingTime: { type: Date }, // Timestamp when order is closed (optional)
  profitLoss: { type: Number }, 
  direction:{type:String, required:true},
  userId: { type: Number, required: true }, // User ID (optional)
  status: { type: String, default: 'closed', enum: ['open', 'closed'] } // Order status
});

// Auto-increment termCode before saving
orderSchema.pre('save', async function (next) {
  const doc = this;

  if (doc.isNew) {
    try {
      const counter = await orderCounter.findByIdAndUpdate(
        { _id: 'termCode' },
        { $inc: { seq:10000 } },
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