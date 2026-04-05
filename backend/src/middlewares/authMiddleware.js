import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const jwtMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({ message: 'No Token' });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No Token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
}

export const checkForgotPasswordMiddleware = async (req, res, next) => {
    try {
        const { username } = req.body;
        const cleanUsername = username?.trim();

        if (!cleanUsername) {
            return res.status(400).json({ message: "Cần nhập tài khoản" });
        }

        const user = await User.findOne({ username: cleanUsername });

        if (!user) {
            return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        req.userFound = user;
        next();
    } catch (error) {
        next(error);
    }
}