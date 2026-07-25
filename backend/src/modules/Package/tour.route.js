import express from "express";
import { publicLimiter } from "../../../middleware/rateLimit.middleware.js";
import {
  createTourController,
  deleteTourController,
  getAllActiveToursController,
  getAllTourController,
  getTourByIdController,
  updateTourController,
} from "./tour.controller.js";
import authMiddleware from "../../../middleware/auth.middleware.js";

const router = express.Router();

//public

router.get("/", publicLimiter, getAllActiveToursController);

router.get("/:id", publicLimiter, getTourByIdController);

// admin

router.get("/admin", authMiddleware, getAllTourController);

router.post("/admin", authMiddleware, createTourController);

router.put("admin/:id", authMiddleware, updateTourController);

router.delete("admin/:id", authMiddleware, deleteTourController);

export default router;
