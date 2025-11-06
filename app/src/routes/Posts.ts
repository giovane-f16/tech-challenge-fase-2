import { Router } from "express";
import { Post as PostController } from "../controllers/Post";
import { PostModel } from "../models/Post";
import Database from "../providers/Database";
import { authenticateJWT } from "../middlewares/Auth";

export async function createRouter() {
    const router = Router();
    const database = new Database;
    await database.conectar();

    const post_model = new PostModel(database);
    const controller = new PostController(post_model);

    router.get("/", controller.getAll);
    router.get("/search", controller.search);
    router.get("/date/:data", controller.getByDate);
    router.get("/:id/thumbnail", controller.getThumbnail);
    router.get("/:id", controller.getById);
    router.post("/", authenticateJWT, controller.create);
    router.put("/:id", authenticateJWT, controller.update);
    router.delete("/:id", authenticateJWT, controller.delete);

    return router;
}

export default createRouter;