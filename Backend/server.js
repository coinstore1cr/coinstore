import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Order from "./models/order.js";
import getBTCPrice from "./models/cryptoService.js";

dotenv.config();

const app = express();
app.use(cors());
// Middleware
// const allowedOrigins = ["https://coinstorect.site"];
// app.use(
//     cors({
//         origin: (origin, callback) => {
//             if (allowedOrigins.includes(origin) {
//                 callback(null, true);
//             } else {
//                 callback(new Error("Not allowed by CORS"));
//             }
//         },
//         credentials: true,
//     })
// );
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  })
  
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1); // Exit process on connection failure
  });

// Counter Schema for UID Auto-Increment
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1010 },
});
const Counter = mongoose.model("Counter", counterSchema);

// User Schema with Auto-Increment UID
const userSchema = new mongoose.Schema({
  uid: { type: Number, unique: true }, // Auto-incrementing UID
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  invitationCode: { type: String, required: true },
  balance: { type: Number, default: 0 }, // Default balance
  vipLevel: { type: Number, default: 1 }, // Default VIP level
});

// Auto-increment UID and hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Only auto-increment for new users
    const counter = await Counter.findByIdAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } }, // Increment UID by 1
      { new: true, upsert: true } // Create counter if not exists
    );
    this.uid = counter.seq; // Assign auto-incremented UID
  }

  // Hash the password before saving
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

const User = mongoose.model("User", userSchema);

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, uid: user.uid, email: user.email }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // Expiration
  );
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token after "Bearer "


  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = user; // Attach user data to the request object
    next();
  });
};

// Registration Endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { email, password, confirmPassword, invitationCode } = req.body;

    // Validation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({ email, password, invitationCode });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Registration successful", uid: newUser.uid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords (hashed check)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Send the token and user data back to the client
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
    const { amount } = req.body;
     // Fetch BTC price (example function)

    const allowedAmounts = [400, 1000, 3000, 4400];

    const user = await User.findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let newBalance = user.balance;
    let profitLoss = 0; 
    // Calculate profit or loss
    if (allowedAmounts.includes(amount)) {
      // If the amount is valid, add 30% profit to the balance
      newBalance += amount * 0.3;
      profitLoss = amount * 0.3;
    } else {
      // If the amount is invalid, deduct the amount from the balance
      newBalance -= amount;
      profitLoss = -amount;
    }

    // Update the user's balance in the database
    await User.updateOne({ uid: userId }, { balance: newBalance });


    const btcPrice = await getBTCPrice();

    const newOrder = new Order({
      openingPrice: btcPrice,
      closingPrice: req.body.closingBtcPrice, // Will update later
      time: req.body.time,
      buyAmount: req.body.amount,
      openingTime: new Date(),
      closingTime: new Date(Date.now() + req.body.time * 1000),
      profitLoss: profitLoss,
      direction: req.body.direction,
      userId: userId, // Store the user UID in the order
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

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
    
    // Fetch all orders for the user
    const orders = await Order.find({ userId });
    
    // Send the orders back to the client
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
});
