import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware function to check JWT token manually
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token = null;

    // Extract token from Authorization header or cookies
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    // If no token found, return unauthorized response
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach decoded user data to request
        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};
