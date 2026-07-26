import express from "express";
import { publicLimiter } from "../../../middleware/rateLimit.middleware.js";

import authMiddleware from "../../../middleware/auth.middleware.js";
import { createPackageController, deletePackageController, getAllActivePackagesController, getAllPackageController, getPackageByIdController, updatePackageController } from "./package.controller.js";
import { getPackageById } from "./package.service.js";

const router = express.Router();

//public

router.get("/", publicLimiter, getAllActivePackagesController);


// admin

router.get("/admin", authMiddleware, getAllPackageController);

router.post("/admin", authMiddleware, createPackageController);

router.put("/admin/:id", authMiddleware, updatePackageController);

router.delete("/admin/:id", authMiddleware, deletePackageController);

// public

router.get("/:id", publicLimiter, getPackageByIdController);

export default router;
