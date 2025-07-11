"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// index.ts
var import_express2 = __toESM(require("express"));

// src/routes/Posts.ts
var import_express = require("express");

// src/schemas/Post.ts
var import_zod = require("zod");
var postSchema = import_zod.z.object({
  titulo: import_zod.z.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio"),
  conteudo: import_zod.z.string().min(1, "Conte\xFAdo \xE9 obrigat\xF3rio"),
  autor: import_zod.z.string().min(1, "Autor \xE9 obrigat\xF3rio")
});
var partialPostSchema = postSchema.partial();

// src/controllers/Post.ts
var posts = [];
var currentId = 1;
var getAllPosts = (req, res) => {
  res.json(posts);
};
var getPostById = (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) {
    res.status(404).json({ error: "Post n\xE3o encontrado" });
    return;
  }
  res.json(post);
};
var searchPosts = (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    res.status(400).json({ error: "Par\xE2metro 'query' obrigat\xF3rio" });
    return;
  }
  const resultado = posts.filter(
    (p) => p.titulo.toLowerCase().includes(query) || p.conteudo.toLowerCase().includes(query)
  );
  res.json(resultado);
};
var getPostsByDate = (req, res) => {
  const { data } = req.params;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(data)) {
    res.status(400).json({ error: "Formato inv\xE1lido. Use yyyy-mm-dd" });
    return;
  }
  const resultado = posts.filter((p) => {
    const [dia, mes, ano] = p.dataDeCriacao.split("/");
    return `${ano}-${mes}-${dia}` === data;
  });
  if (resultado.length === 0) {
    res.status(404).json({ error: "Nenhum post encontrado para essa data." });
    return;
  }
  res.json(resultado);
};
var createPost = (req, res) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.format() });
    return;
  }
  const dataDeCriacao = new Intl.DateTimeFormat("pt-BR").format(/* @__PURE__ */ new Date());
  const novoPost = {
    id: currentId++,
    ...parsed.data,
    dataDeCriacao
  };
  posts.push(novoPost);
  res.status(201).json(novoPost);
};
var updatePost = (req, res) => {
  const id = Number(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === id);
  if (postIndex === -1) {
    res.status(404).json({ error: `N\xE3o encontrado post com o ID: ${id}` });
    return;
  }
  const parsed = partialPostSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.format() });
    return;
  }
  const dataDeAtualizacao = new Intl.DateTimeFormat("pt-BR").format(/* @__PURE__ */ new Date());
  const antigo = posts[postIndex];
  const atualizado = {
    ...antigo,
    ...parsed.data,
    dataDeAtualizacao
  };
  posts[postIndex] = atualizado;
  res.json(atualizado);
};
var deletePost = (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: `N\xE3o encontrado post com o ID: ${id}` });
    return;
  }
  posts.splice(index, 1);
  res.status(204).send();
};

// src/routes/Posts.ts
var router = (0, import_express.Router)();
router.get("/", getAllPosts);
router.get("/search", searchPosts);
router.get("/date/:data", getPostsByDate);
router.get("/:id", getPostById);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
var Posts_default = router;

// index.ts
var app = (0, import_express2.default)();
app.use(import_express2.default.json());
app.use("/posts", Posts_default);
app.listen(3e3, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
