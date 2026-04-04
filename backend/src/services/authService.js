import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const SALT_ROUNDS = 10;

export const signInService = async (data) => {
    try {
        const { username, password } = data;

        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('Sai tài khoản hoặc mật khẩu');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Sai tài khoản hoặc mật khẩu');
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return {
            token,
            user: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                phone: user.phone,
                email: user.email
            }
        };
    } catch (error) {
        throw error;
    }
}

export const signUpService = async (data) => {
    try {
        const { username, password, fullname, phone, email } = data;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await User.create({
            username,
            password: hashedPassword,
            fullname,
            phone,
            email
        });

        return {
            id: user._id,
            username: user.username,
            fullname: user.fullname,
            phone: user.phone,
            email: user.email
        };
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];

            if (field === "phone") {
                throw new Error("Số điện thoại đã tồn tại");
            }

            if (field === "username") {
                throw new Error("Tên đăng nhập đã tồn tại");
            }

            throw new Error(`${field} đã tồn tại`);
        }
    }
}

export const signOutService = async () => {
    return true;
}