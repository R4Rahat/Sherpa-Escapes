import express from "express";

import {
  createFaqController,
  deleteFaqController,
  getAllFaqsController,
  getFaqByIdController,
  getPublicFaqController,
  updateFaqController,
} from "./faq.controller.js";
import { publicLimiter } from "../../../middleware/rateLimit.middleware.js";
import authMiddleware from "../../../middleware/auth.middleware.js";

const router = express.Router();

// public
router.get("/", publicLimiter, getPublicFaqController);

// private

router.get("/admin", authMiddleware, getAllFaqsController);

router.get("/admin/:id", authMiddleware, getFaqByIdController);

router.post("/admin", authMiddleware, createFaqController);

router.put("/admin/:id", authMiddleware, updateFaqController);

router.delete("/admin/:id", authMiddleware, deleteFaqController);

export default router;
