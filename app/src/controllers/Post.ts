import { Request, Response } from "express";
import { PostModel } from "../models/Post";

export class Post {
	private post_model;

	constructor(post_model: PostModel) {
		this.post_model = post_model;
	}

	getAll = async (req: Request, res: Response) => {
		const posts = await this.post_model.findAll();
		res.json(posts);
	}

	getById = async (req: Request, res: Response) => {
		const { id } = req.params;
        try {
            const post = await this.post_model.findById(id);
            if (!post) {
				res.status(404).json({ error: `Post não encontrado com o ID: ${id}` });
				return;
            }
            res.json(post);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar post por ID." });
			return;
        }
	}

	search = async (req: Request, res: Response) => {
        const { titulo, autor, conteudo } = req.query;
        const query: any = {};

		if (titulo) {
			query.titulo = { $regex: titulo as string, $options: "i" };
		}

		if (autor) {
			query.autor = { $regex: autor as string, $options: "i" };
		}

		if (conteudo) {
			query.conteudo = { $regex: conteudo as string, $options: "i" };
		}

        try {
            const posts = await this.post_model.search(query);
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar posts por pesquisa." });
        }
		return;
	}

	getByDate = async (req: Request, res: Response) => {
        const { data } = req.params;
        try {
            const posts = await this.post_model.findByDate(data);
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar posts por data." });
        }
	}

	create = async (req: Request, res: Response) => {
		try {
            const post = await this.post_model.create(req.body);
            res.status(201).json(post);
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar post." });
        }
	}

	update = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const post = await this.post_model.update(id, req.body);
            if (!post) {
                res.status(404).json({ error: "Post não encontrado para atualizar." });
				return;
            }
            res.json(post);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar post." });
        }
	}

	delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const result = await this.post_model.delete(id);
            if (!result) {
                res.status(404).json({ error: `Post ${id} não encontrado para deletar.` });
				return;
            }
            res.json({ message: `Post id: ${id} deletado com sucesso.` });
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar post." });
        }
	}
}