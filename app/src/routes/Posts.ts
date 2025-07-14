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

	router.get("/", 		  controller.getAll);
	router.get("/search", 	  controller.search);
	router.get("/date/:data", controller.getByDate);
	router.get("/:id", 		  controller.getById);
	router.post("/", 		  controller.create);
	router.put("/:id", 		  controller.update);
	router.delete("/:id", 	  controller.delete);
	return router;
}

export default createRouter;
