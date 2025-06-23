import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/order.js';

dotenv.config();

async function dropIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Drop the termCode index
    await Order.collection.dropIndex('termCode_1');
    console.log('Successfully dropped termCode index');

    // Create a new index
    await Order.collection.createIndex({ termCode: 1 }, { unique: true });
    console.log('Successfully created new termCode index');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

dropIndex(); 