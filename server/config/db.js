import mongoose from 'mongoose';
import seedData from '../utils/seedData.js';

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project_monitoring';
        await mongoose.connect(uri);

        const isAtlas = uri.includes('mongodb+srv');
        if (isAtlas) {
            console.log("MongoDB Atlas connected successfully");
        } else {
            console.log("MongoDB Local connected successfully (Simulating Primary DB)");
        }

        await seedData();
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.log("No MongoDB running. Fallback/demo-data mechanism remains available.");
    }
};

export default connectDB;
