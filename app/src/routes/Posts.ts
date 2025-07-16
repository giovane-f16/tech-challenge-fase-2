import { Router } from "express";
import { Post as PostController } from "../controllers/Post";
import { PostModel } from "../models/Post";
import Database from "../providers/Database";
import { authenticateJWT } from "../middlewares/auth";

export async function createRouter() {
	const router     = Router();
	const database   = new Database;
	await database.conectar();

	const post_model = new PostModel(database);
	const controller = new PostController(post_model);

	/**
	 * @openapi
	 * /posts:
	 *   get:
	 *     tags:
	 *       - Posts
	 *     summary: Retorna todos os posts
	 *     responses:
	 *       200:
	 *         description: Lista de posts retornada com sucesso
	 */
	router.get("/", controller.getAll);

	/**
	 * @openapi
	 * /posts/search:
	 *   get:
	 *     tags:
	 *       - Posts
	 *     summary: Busca posts por parâmetros
	 *     parameters:
	 *       - in: query
	 *         name: termo
	 *         schema:
	 *           type: string
	 *         required: false
	 *         description: Termo de busca
	 *     responses:
	 *       200:
	 *         description: Lista filtrada de posts
	 */
	router.get("/search", controller.search);

	/**
	 * @openapi
	 * /posts/date/{data}:
	 *   get:
	 *     tags:
	 *       - Posts
	 *     summary: Busca posts por data
	 *     parameters:
	 *       - in: path
	 *         name: data
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Data no formato YYYY-MM-DD
	 *     responses:
	 *       200:
	 *         description: Lista de posts da data especificada
	 */
	router.get("/date/:data", controller.getByDate);

	/**
	 * @openapi
	 * /posts/{id}:
	 *   get:
	 *     tags:
	 *       - Posts
	 *     summary: Busca um post pelo ID
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: ID do post
	 *     responses:
	 *       200:
	 *         description: Post encontrado
	 *       404:
	 *         description: Post não encontrado
	 */
	router.get("/:id", controller.getById);

	/**
	 * @openapi
	 * /posts:
	 *   post:
	 *     tags:
	 *       - Posts
	 *     summary: Cria um novo post
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - titulo
	 *               - conteudo
	 *               - autor
	 *             properties:
	 *               titulo:
	 *                 type: string
	 *               conteudo:
	 *                 type: string
	 *               autor:
	 *                 type: string
	 *     responses:
	 *       201:
	 *         description: Post criado com sucesso
	 */
	router.post("/", authenticateJWT, controller.create);

	/**
	 * @openapi
	 * /posts/{id}:
	 *   put:
	 *     tags:
	 *       - Posts
	 *     summary: Atualiza um post existente
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               titulo:
	 *                 type: string
	 *               conteudo:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: Post atualizado com sucesso
	 */
	router.put("/:id", authenticateJWT, controller.update);

	/**
	 * @openapi
	 * /posts/{id}:
	 *   delete:
	 *     tags:
	 *       - Posts
	 *     summary: Remove um post
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       204:
	 *         description: Post deletado com sucesso
	 */
	router.delete("/:id", authenticateJWT, controller.delete);

	return router;
}

export default createRouter;