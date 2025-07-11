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
var router = (0, import_express.Router)();
var posts = [];
var currentId = 1;
router.get("/", (req, res) => {
  res.json(posts);
});
router.get("/search", (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    res.status(400).json({ error: "Par\xE2metro 'query' obrigat\xF3rio" });
    return;
  }
  const resultado = posts.filter(
    (p) => p.titulo.toLowerCase().includes(query) || p.conteudo.toLowerCase().includes(query)
  );
  res.json(resultado);
});
router.get("/date/:data", (req, res) => {
  const { data } = req.params;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(data)) {
    res.status(400).json({ error: "Formato de data inv\xE1lido. Use yyyy-mm-dd" });
    return;
  }
  const resultado = posts.filter((p) => {
    const [dia, mes, ano] = p.dataDeCriacao.split("/");
    const dataFormatada = `${ano}-${mes}-${dia}`;
    return dataFormatada === data;
  });
  if (resultado.length === 0) {
    res.status(404).json({ error: "N\xE3o foi encontrado nenhum post com a data informada." });
    return;
  }
  res.json(resultado);
});
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) {
    res.status(404).json({ error: `Post n\xE3o encontrado com este ID: ${id}` });
    return;
  }
  res.json(post);
});
router.post("/", (req, res) => {
  const { titulo, conteudo, autor } = req.body;
  if (!titulo || !conteudo || !autor) {
    res.status(400).json({ error: "Todos os campos s\xE3o obrigat\xF3rios" });
    return;
  }
  let dataDeCriacao = new Intl.DateTimeFormat("pt-BR").format(/* @__PURE__ */ new Date());
  const novoPost = {
    id: currentId++,
    titulo,
    conteudo,
    autor,
    dataDeCriacao
  };
  posts.push(novoPost);
  res.status(201).json(novoPost);
});
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { titulo, conteudo, autor } = req.body;
  const postIndex = posts.findIndex((p) => p.id === id);
  if (postIndex === -1) {
    res.status(404).json({ error: `Post n\xE3o encontrado com este ID: ${id}` });
    return;
  }
  let dataDeAtualizacao = new Intl.DateTimeFormat("pt-BR").format(/* @__PURE__ */ new Date());
  const postAntigo = posts[postIndex];
  const postAtualizado = {
    ...postAntigo,
    titulo: titulo ?? postAntigo.titulo,
    conteudo: conteudo ?? postAntigo.conteudo,
    autor: autor ?? postAntigo.autor,
    dataDeAtualizacao
  };
  posts[postIndex] = postAtualizado;
  res.json(postAtualizado);
});
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: `Post n\xE3o encontrado com este ID: ${id}` });
    return;
  }
  posts.splice(index, 1);
  res.status(204).send();
});
var Posts_default = router;

// index.ts
var app = (0, import_express2.default)();
app.use(import_express2.default.json());
app.get("/", (req, res) => {
  res.json({ message: "hello world with Typescript!!" });
});
app.use("/posts", Posts_default);
app.listen(3e3, () => console.log("server running on port 3000"));
