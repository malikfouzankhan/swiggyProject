import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function dbConnect()
{
    try {
        const URI = process.env.DB_URI;
        await mongoose.connect(URI);
        console.log(`MongoDB connected!!`);
    } catch (error) {
        console.log(error.message);
    }
}

dbConnect();