import express from "express";
import dotenv from 'dotenv'
import fs from 'fs'
import { MongoClient } from "mongodb";
import path from "path";
import cors from 'cors'
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from 'http'

import AuthRoutes from './routes/AuthRoutes.js'
import connectDb from "./config/db.js";
import { verifyToken } from "./middlewares/verifyTokens.js";
import { socketEvents } from "./controllers/socketController.js";
// import UserRoutes from './routes/UserRoutes.js'

const app = express()
dotenv.config()
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json())
const server = http.createServer(app);
const io = new Server(server, { cors: true });
const port = process.env.PORT
const hn = process.env.hostName

// For connection with Mongodb
connectDb()

socketEvents(io);

app.get('/home', verifyToken, (req, res) => {
    return res.json({ valid: true, message: "authorized" })
})
app.use('/auth', AuthRoutes)


server.listen(port, hn, () => console.log(`Server running at http://${hn}:${port}`));
