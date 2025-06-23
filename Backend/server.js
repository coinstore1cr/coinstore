import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Order from "./models/order.js";
import User from "./models/user.js";
import getBTCPrice from "./models/cryptoService.js";
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1);
  });

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, uid: user.uid, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = user;
    next();
  });
};

// Use routes
app.use('/api', userRoutes);

// Registration Endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { email, password, confirmPassword, invitationCode } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({ email, password, invitationCode });
    await newUser.save();

    res.status(201).json({ message: "Registration successful", uid: newUser.uid });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, uid: user.uid, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create Order Endpoint (Protected)
app.post("/api/orders", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { amount, time, direction, name } = req.body;

    const user = await User.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const newBalance = user.balance - amount;
    await User.updateOne({ uid: userId }, { balance: newBalance });

    const btcPrice = await getBTCPrice();
    const orderId = new mongoose.Types.ObjectId().toString();

    const orderData = {
      orderId,
      userId,
      name: name || 'BTC-Second Contract',
      openingPrice: btcPrice,
      time,
      amount,
      direction,
      openingTime: new Date(),
      closingTime: new Date(Date.now() + time * 1000),
      status: 'active'
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message });
  }
});

// Helper function to calculate profit/loss
function calculateProfitLoss(order, closingPrice) {
  const priceChange = closingPrice - order.openingPrice;
  const isWin = (order.direction === 'up' && priceChange > 0) || 
                (order.direction === 'down' && priceChange < 0);
  
  return isWin ? order.amount * 0.3 : -order.amount;
}

// Protected Route: Get User Data (Requires Token)
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Changed from req.user.userId to req.user.id
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      email: user.email,
      uid: user.uid,
      balance: user.balance,
      vipLevel: user.vipLevel,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// Fetch Orders by User ID (Protected Route)
app.get("/api/orderhistory", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid; // Extract user UID from the token
    
    // Fetch all orders for the user and sort by openingTime in descending order (newest first)
    const orders = await Order.find({ userId }).sort({ openingTime: -1 });
    
    // Send the orders back to the client
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Order Endpoint (Protected)
app.patch("/api/orders/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order with new data
    Object.assign(order, updateData);
    await order.save();

    // If order is completed, update user balance
    if (updateData.status === 'completed' && updateData.profitLoss !== undefined) {
      const user = await User.findOne({ uid: order.userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Calculate the total amount to add/subtract
      let balanceUpdate = 0;
      if (updateData.profitLoss > 0) {
        // If profit, add both profit and original amount
        balanceUpdate = updateData.profitLoss + order.amount;
      } else {
        // If loss, only the original amount was already deducted
        balanceUpdate = 0;
      }

      // Update user balance
      await User.updateOne(
        { uid: order.userId },
        { $inc: { balance: balanceUpdate } }
      );
    }

    res.json({ message: "Order updated successfully", order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Token refresh endpoint
app.post('/refresh-token', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Error refreshing token' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
