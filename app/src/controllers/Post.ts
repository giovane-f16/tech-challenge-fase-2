import { Request, Response } from "express";
import { PostModel } from "../models/Post";
import { postSchema, partialPostSchema } from "../schemas/Post";

export class Post {
	private post_model;

	constructor(post_model: PostModel) {
		this.post_model = post_model;
	}

	getAllPosts =  async (req: Request, res: Response) => {
		const posts = await this.post_model.findAll();
		res.json(posts);
	};

	// getPostById = (req: Request, res: Response) => {
	// 	const id = Number(req.params.id);
	// 	const post = this.post.find(p => p.id === id);
	// 	if (!post) {
	// 		res.status(404).json({ error: "Post não encontrado" });
	// 		return;
	// 	}
	// 	res.json(post);
	// };

	// searchPosts = (req: Request, res: Response) => {
	// 	const { query } = req.query;
	// 	if (!query || typeof query !== "string") {
	// 		res.status(400).json({ error: "Parâmetro 'query' obrigatório" });
	// 		return;
	// 	}

	// 	const resultado = this.post.filter(p =>
	// 		p.titulo.toLowerCase().includes(query) ||
	// 		p.conteudo.toLowerCase().includes(query)
	// 	);

	// 	if (resultado.length == 0) {
	// 		res.status(404).json({ error: `Nenhum post encontrado com este termo: ${query}` });
	// 		return;
	// 	}

	// 	res.json(resultado);
	// };

	// getPostsByDate = (req: Request, res: Response) => {
	// 	const { data } = req.params;
	// 	const regex = /^\d{4}-\d{2}-\d{2}$/;
	// 	if (!regex.test(data)) {
	// 		res.status(400).json({ error: "Formato inválido. Use yyyy-mm-dd" });
	// 		return;
	// 	}

	// 	const resultado = this.post.filter((p) => {
	// 		const [dia, mes, ano] = p.dataDeCriacao.split("/");
	// 		return `${ano}-${mes}-${dia}` === data;
	// 	});

	// 	if (resultado.length === 0) {
	// 		res.status(404).json({ error: "Nenhum post encontrado para essa data." });
	// 		return;
	// 	}

	// 	res.json(resultado);
	// };

	// createPost = (req: Request, res: Response) => {
	// 	const parsed = postSchema.safeParse(req.body);
	// 	if (!parsed.success) {
	// 		res.status(400).json({ error: parsed.error.format() });
	// 		return;
	// 	}

	// 	const dataDeCriacao = new Intl.DateTimeFormat("pt-BR").format(new Date());

	// 	const novoPost: Post = {
	// 		id: currentId++,
	// 		...parsed.data,
	// 		dataDeCriacao
	// 	};

	// 	this.post.push(novoPost);
	// 	res.status(201).json(novoPost);
	// };

	// updatePost = (req: Request, res: Response) => {
	// 	const id = Number(req.params.id);
	// 	const postIndex = posts.findIndex(p => p.id === id);
	// 	if (postIndex === -1) {
	// 		res.status(404).json({ error: `Não encontrado post com o ID: ${id}` });
	// 		return;
	// 	}

	// 	const parsed = partialPostSchema.safeParse(req.body);
	// 	if (!parsed.success) {
	// 		res.status(400).json({ error: parsed.error.format() });
	// 		return;
	// 	}

	// 	const dataDeAtualizacao = new Intl.DateTimeFormat("pt-BR").format(new Date());
	// 	const antigo = posts[postIndex];

	// 	const atualizado: Post = {
	// 		...antigo,
	// 		...parsed.data,
	// 		dataDeAtualizacao
	// 	};

	// 	posts[postIndex] = atualizado;
	// 	res.json(atualizado);
	// };

	// deletePost = (req: Request, res: Response) => {
	// 	const id = Number(req.params.id);
	// 	const index = posts.findIndex(p => p.id === id);
	// 	if (index === -1) {
	// 		res.status(404).json({ error: `Não encontrado post com o ID: ${id}` });
	// 		return;
	// 	}
	// 	posts.splice(index, 1);
	// 	res.status(204).send();
	// };
}

