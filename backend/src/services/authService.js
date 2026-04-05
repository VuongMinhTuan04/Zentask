import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const SALT_ROUNDS = 10;

export const signInService = async (data) => {
    try {
        const { username, password } = data;

        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
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

        const duplicate = await User.findOne({ username });
        if (duplicate) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

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

export const changeInfoService = async (userId, data) => {
    try {
        const { fullname, phone } = data;
        
        if (!fullname?.trim()) {
            throw new Error("Họ và tên không được để trống");
        }

        if (!phone?.trim()) {
            throw new Error("Số điện thoại không được để trống");
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullname, phone },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            throw new Error("User không tồn tại");
        }

        return updatedUser;
    } catch (error) {
        throw error;
    }
}

export const changePasswordService = async (userId, data) => {
    try {
        const { oldPassword, newPassword } = data;
        const user = await User.findById(userId);

        if(!user) {
            throw new Error('User không tồn tại');
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        
        if(!isMatch) {
            throw new Error('Mật khẩu cũ không đúng');
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        user.password = hashedPassword;
        await user.save();
        
        return true;
    } catch (error) {
        throw error;
    }
}

export const forgotPasswordService = async (user, password) => {
    try {
        if (typeof password !== "string" || password.length < 6) {
            throw new Error("Mật khẩu phải ít nhất 6 ký tự");
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        user.password = hashedPassword;
        await user.save();
        
        return true;
    } catch (error) {
        throw error;
    }
}