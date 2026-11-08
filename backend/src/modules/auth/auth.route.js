import { Router } from "express";
import { body } from "express-validator";
import { authLimiter } from "../../../middleware/rateLimit.middleware.js";
import authMiddleware from "../../../middleware/auth.middleware.js";
import { loginController, logoutController, getMeController } from "./auth.controller.js";

const router = Router();

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginController,
);

router.post("/logout", logoutController);
router.get("/me", authMiddleware, getMeController);

export default router;

