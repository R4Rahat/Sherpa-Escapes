import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./src/modules/Auth/auth.route.js";
import tourRoutes from "./src/modules/Package/package.route.js";
import bookingRoutes from "./src/modules/Booking/booking.route.js";
import blogRoutes from "./src/modules/Blog/blog.routes.js";
import enquiryRoutes from "./src/modules/Enquiry/enquiry.route.js";

import errorMiddleware from "./middleware/error.middleware.js";


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

app.use("/api/v1/bookings", bookingRoutes);

app.use("/api/v1/blogs", blogRoutes);

app.use("/api/v1/enquires", enquiryRoutes);

app.use(errorMiddleware);

export default app;
