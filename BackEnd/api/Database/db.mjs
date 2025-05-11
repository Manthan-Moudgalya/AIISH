import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

const connectDB = async () => {
    if(isConnected) return;
    try {
        await mongoose.connect(process.env.DB_URI);
            isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error in MongoDB isConnected: ', error);
        process.exit(1);
    }
};

export default connectDB; 