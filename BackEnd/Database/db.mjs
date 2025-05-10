import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {

    // console.log("HERE!!!!!");
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error in MongoDB connection: ', error);
        process.exit(1);
    }
};

export default connectDB; 