import mongoose from "mongoose";

const Schema = mongoose.Schema; 

const Task = new Schema({
    title: {
        type: String,
        maxLength: 15,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        default: "...",
        maxLength: 150,
        trim: true,
    },
    status: {
        type: String,
        enum: ["Chưa Làm", "Đang Làm", "Hoàn Thành"],
        default: "Chưa Làm",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        },
    ],
    completedAt: { type: Date },
}, {
    timestamps: true
});

export default mongoose.model('Task', Task);