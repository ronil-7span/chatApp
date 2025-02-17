import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDb Connected : ${con.connection.host}`)
    } catch (error) {
        console.error(`Error : ${error.message}`)
    }
}

export default connectDb;