import { Router, Request, Response } from "express";
import { Post } from "../models/Post";

const router = Router();
let posts: Post[] = [];
let currentId = 1;

router.get("/", (req: Request, res: Response) => {
	res.json(posts);
});

router.get("/search", (req: Request, res: Response) => {
	const { query } = req.query;
	if (!query || typeof query !== "string") {
		res.status(400).json({ error: "Parâmetro 'query' obrigatório" });
		return;
	}

	const resultado = posts.filter((p) =>
		p.titulo.toLowerCase().includes(query) || p.conteudo.toLowerCase().includes(query)
	);

	res.json(resultado);
});

router.get("/date/:data", (req: Request, res: Response) => {
	const { data } = req.params;
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!regex.test(data)) {
		res.status(400).json({ error: "Formato de data inválido. Use yyyy-mm-dd" });
		return;
	}

	const resultado = posts.filter((p) => {
		const [dia, mes, ano] = p.dataDeCriacao.split("/");
		const dataFormatada = `${ano}-${mes}-${dia}`;
		return dataFormatada === data;
	});

	if (resultado.length === 0) {
		res.status(404).json({ error: "Não foi encontrado nenhum post com a data informada." });
		return;
	}

	res.json(resultado);
});

router.get("/:id", (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const post = posts.find((p) => p.id === id);
	if (!post) {
		res.status(404).json({ error: `Post não encontrado com este ID: ${id}` });
		return;
	}

	res.json(post);
});

router.post("/", (req: Request, res: Response) => {
	const { titulo, conteudo, autor } = req.body;

	if (!titulo || !conteudo || !autor ) {
		res.status(400).json({ error: "Todos os campos são obrigatórios" });
		return;
	}

	let dataDeCriacao: string = new Intl.DateTimeFormat("pt-BR").format(new Date());

	const novoPost: Post = {
		id: currentId++,
		titulo,
		conteudo,
		autor,
		dataDeCriacao
	};

	posts.push(novoPost);
	res.status(201).json(novoPost);
});

router.put("/:id", (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const { titulo, conteudo, autor } = req.body;

	const postIndex = posts.findIndex((p) => p.id === id);
	if (postIndex === -1) {
		res.status(404).json({ error: `Post não encontrado com este ID: ${id}` });
		return;
	}

	let dataDeAtualizacao: string = new Intl.DateTimeFormat("pt-BR").format(new Date());
	const postAntigo = posts[postIndex];

	const postAtualizado = {
		...postAntigo,
		titulo:   titulo   ?? postAntigo.titulo,
		conteudo: conteudo ?? postAntigo.conteudo,
		autor:    autor    ?? postAntigo.autor,
		dataDeAtualizacao
	};

	posts[postIndex] = postAtualizado;
	res.json(postAtualizado);
});

router.delete("/:id", (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const index = posts.findIndex((p) => p.id === id);

	if (index === -1) {
		res.status(404).json({ error: `Post não encontrado com este ID: ${id}` });
		return;
	}

	posts.splice(index, 1);
	res.status(204).send();
});

export default router;
