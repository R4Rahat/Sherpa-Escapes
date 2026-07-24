import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/modules/auth/auth.route.js';

dotenv.config();


const app = express();


app.use(cors());
app.use(express.json());

app.get("/running", (req, res) => {
    res.send("Server is running");
});

app.use("/api/v1/auth", authRoutes);


export default app;