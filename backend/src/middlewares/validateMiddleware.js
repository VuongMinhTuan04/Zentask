import mongoose from "mongoose";
import User from "../models/User.js";

export const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    //Kiểm tra ID có hợp lệ hay không
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    next();
}

export const validateSignUp = async (req, res, next) => {
    const { username, password, fullname, phone, email } = req.body;

    const field = { username, password, fullname, phone, email };
    const missingField = Object.keys(field).filter(key => !field[key]);

    if (missingField.length > 0) {
        return res.status(400).json({ message: `${missingField.join(', ')} are required` });
    }

    next();
};