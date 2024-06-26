import express from 'express';
import { commentOnPost, deleteComment, deletePost, getFeedPosts, getUserPosts, hideLikes, likePost } from "../controllers/posts.js";
import {authenticationMiddleware} from "../middlewares/auth.js";

const router = express.Router();

router.get("/:id", authenticationMiddleware, getFeedPosts);
router.delete("/:postId/delete", authenticationMiddleware, deletePost);
router.get("/:id/posts", authenticationMiddleware, getUserPosts);
router.patch("/:id/like", authenticationMiddleware, likePost);
router.patch("/:id/hide", authenticationMiddleware, hideLikes);
router.patch("/:id/comment", authenticationMiddleware, commentOnPost).delete("/:id/comment", authenticationMiddleware, deleteComment);

export default router;