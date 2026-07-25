import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/modules/auth/auth.route.js';
import tourRoutes from './src/modules/Package/tour.route.js';
import errorMiddleware from './middleware/error.middleware.js';

dotenv.config();


const app = express();


app.use(cors());
app.use(express.json());

app.get("/running", (req, res) => {
    res.send("Server is running");
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/tours", tourRoutes);

app.use(errorMiddleware);


export default app;