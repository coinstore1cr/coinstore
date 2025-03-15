// counter.js
import mongoose  from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Collection name (e.g., 'termCode')
  seq: { type: Number, default: 2025723451 } // Starting sequence number
});

// Create the Counter model
const orderCounter = mongoose.model('orderCounter', counterSchema);

export default orderCounter;