import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.log("Mongoose connect error...", error)
        throw error
    }
}

export default connectDB;