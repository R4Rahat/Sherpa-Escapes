import express from "express";
import {
  createTestimonialController,
  deleteTestimonialController,
  getAllTestimonialsController,
  getPublicTestimonialsController,
  getTestimonialByIdController,
  updateTestimonialController,
} from "./testimonial.controller.js";
import { publicLimiter } from "../../../middleware/rateLimit.middleware.js";
import authMiddleware from "../../../middleware/auth.middleware.js";

const router = express.Router();

// public
router.get("/", publicLimiter, getPublicTestimonialsController);

// private

router.get("/admin", authMiddleware, getAllTestimonialsController);

router.get("/admin/:id", authMiddleware, getTestimonialByIdController);

router.post("/admin", authMiddleware, createTestimonialController);

router.put("/admin/:id", authMiddleware, updateTestimonialController);

router.delete("/admin/:id", authMiddleware, deleteTestimonialController);

export default router;
