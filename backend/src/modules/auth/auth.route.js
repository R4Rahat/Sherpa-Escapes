import { Router } from "express";
import { body } from "express-validator";
import { authLimiter } from "../../../middleware/rateLimit.middleware.js";
import { loginController } from "./auth.controller.js";



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

export default router;

