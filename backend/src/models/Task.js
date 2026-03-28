import mongoose from "mongoose";

const Schema = mongoose.Schema; 

const Task = new Schema({
    title: {
        type: String,
        maxLength: 15,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        maxLength: 150,
        trim: true
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do'
    },
    userId: {
        type: String,
        default: '1'
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Users',
        // required: true
    },
    completedAt: { type: Date }
}, {
    timestamps: true
});

export default mongoose.model('Task', Task);