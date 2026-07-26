import express from "express";
import { getEnquiryController } from "./enquiry.controller.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import { getEnquiryByIdController } from "./enquiry.controller.js";
import { createEnquiryController } from "./enquiry.controller.js";
import {publicLimiter} from "../../../middleware/rateLimit.middleware.js";
import { updateEnquiryController } from "./enquiry.controller.js";
import { deleteEnquiryController } from "./enquiry.controller.js";

const router = express.Router();


//public
router.post("/", publicLimiter, createEnquiryController);

//admin
router.get("/", authMiddleware, getEnquiryController);

router.get("/:id", authMiddleware, getEnquiryByIdController);

router.put("/:id", authMiddleware, updateEnquiryController);

router.delete("/:id", authMiddleware, deleteEnquiryController);

export default router;
