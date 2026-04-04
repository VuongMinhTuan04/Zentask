import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    }
}, {
    timestamps: true
});

export default mongoose.model('User', User);