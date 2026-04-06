import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING, {
            dbName: 'ZenTask'
        });
        console.log('Connected Success!');
    } catch (error) {
        console.error('Connected Error By: ', error);
        process.exit(1);
    }
}

