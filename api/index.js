import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js"

dotenv.config();
const app = express();

const connect = async ()=> {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB")
    } catch (error){
        throw error;
    }
};
mongoose.connection.on("disconnected",()=>{
    console.log("MongoDB disconnected");
})
mongoose.connection.on("connected",()=>{
    console.log("MongoDB connected");
})
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/hotels",hotelsRoute);
app.use("/api/rooms",roomsRoute);

// error handling middleware

/*app.use((err,req,res,next) => {
    return res.status(500).send("Error occured in API Calling");
})*/



app.listen(3000,()=> {
    connect();
    console.log("App is listening on port 3000");
})