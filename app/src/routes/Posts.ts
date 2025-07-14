import { Router } from "express";
import { Post as PostController } from "../controllers/Post";
import { PostModel } from "../models/Post";
import Database from "../providers/Database";

export async function createRouter() {
	const router     = Router();
	const database   = new Database;
	await database.conectar();

	const post_model = new PostModel(database);
	const controller = new PostController(post_model);

	router.get("/", 		  controller.getAllPosts);
	// router.get("/search", 	  controller.searchPosts);
	// router.get("/data/:data", controller.getPostsByDate);
	// router.get("/:id", 		  controller.getPostById);
	// router.post("/", 		  controller.createPost);
	// router.put("/:id", 		  controller.updatePost);
	// router.delete("/:id", 	  controller.deletePost);
	return router;
}

export default createRouter;
