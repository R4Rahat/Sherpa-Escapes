import express from "express";
import {
  createBookingController,
  deleteBookingController,
  getAllBookingsController,
  getBookingByIdController,
  updateBookingController,
} from "./booking.controller.js";
import authMiddleware from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllBookingsController);

router.get("/:id", authMiddleware, getBookingByIdController);

router.post("/", authMiddleware, createBookingController);

router.put("/:id", authMiddleware, updateBookingController);

router.delete("/:id", authMiddleware, deleteBookingController);

export default router;
