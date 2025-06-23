import express from 'express';
import pool from '../db.js';
import { authMiddleware as auth } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// Generate JWT token helper function
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, uid: user.uid, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
};

// Fetch all users
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a route to validate the token
router.get('/validate-token', auth, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});

// Token refresh endpoint
router.post('/refresh-token', auth, async (req, res) => {
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

export default router;
