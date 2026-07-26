import express from 'express';
import { createBlogController, deleteBlogController, getAllBlogsController, getBlogByIdController, updateBlogController } from './blog.controller.js';
import { publicLimiter } from '../../../middleware/rateLimit.middleware.js';
import authMiddleware from '../../../middleware/auth.middleware.js';



const router = express.Router();

// public + private
router.get("/", publicLimiter, getAllBlogsController);

// public + private
router.get(":id", publicLimiter, getBlogByIdController);

// private
router.post("/", authMiddleware, createBlogController);


// private
router.put("/:id", authMiddleware, updateBlogController);

// private
router.delete("/:id", authMiddleware, deleteBlogController);



export default router