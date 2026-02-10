import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URL || process.env.ATLASDB_URL;
export const connectDB = async () => {
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        return false;
    }
};

export const disconnectDB = async () => {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
};
