import { Router } from "express";
import {
	getAllPosts,
	getPostById,
	searchPosts,
	getPostsByDate,
	createPost,
	updatePost,
	deletePost
} from "../controllers/Post";

const router = Router();

router.get("/", getAllPosts);
router.get("/search", searchPosts);
router.get("/date/:data", getPostsByDate);
router.get("/:id", getPostById);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
