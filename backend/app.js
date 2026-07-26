import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/modules/Auth/auth.route.js";
import tourRoutes from "./src/modules/Package/package.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.get("/running", (req, res) => {
  res.send("Server is running");
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/packages", tourRoutes);

app.use(errorMiddleware);

export default app;
