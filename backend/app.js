import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/modules/Auth/auth.route.js";
import tourRoutes from "./src/modules/Package/package.route.js";
import bookingRoutes from "./src/modules/Booking/booking.route.js";
import blogRoutes from "./src/modules/Blog/blog.routes.js";
import enquiryRoutes from "./src/modules/Enquiry/enquiry.route.js";
import testimonialRoutes from "./src/modules/Testimonial/testimonial.route.js";
import faqRoutes from "./src/modules/Faq/faq.route.js";

import errorMiddleware from "./middleware/error.middleware.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/running", (req, res) => {
  res.send("Server is running");
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/packages", tourRoutes);

app.use("/api/v1/bookings", bookingRoutes);

app.use("/api/v1/blogs", blogRoutes);

app.use("/api/v1/enquires", enquiryRoutes);

app.use("/api/v1/testimonials", testimonialRoutes);

app.use("/api/v1/faqs", faqRoutes);

// Static frontend serving (for production & express hosting)
const frontendDistPath = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(frontendDistPath));

// Fallback to React index.html for SPA client-side routing (ignoring /api routes)
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
      if (err) next();
    });
  }
  next();
});

app.use(errorMiddleware);

export default app;
