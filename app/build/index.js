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
var import_dotenv3 = __toESM(require("dotenv"));

// src/routes/Posts.ts
var import_express = require("express");

// src/controllers/Post.ts
var Post = class {
  constructor(post_model) {
    this.getAll = async (req, res) => {
      const posts = await this.post_model.findAll();
      res.json(posts);
    };
    this.getById = async (req, res) => {
      const { id } = req.params;
      try {
        const post = await this.post_model.findById(id);
        if (!post) {
          res.status(404).json({ error: `Post n\xE3o encontrado com o ID: ${id}` });
          return;
        }
        res.json(post);
      } catch (error) {
        res.status(500).json({ error: "Erro ao buscar post por ID." });
        return;
      }
    };
    this.search = async (req, res) => {
      const { titulo, autor, conteudo } = req.query;
      const query = {};
      if (titulo) {
        query.titulo = { $regex: titulo, $options: "i" };
      }
      if (autor) {
        query.autor = { $regex: autor, $options: "i" };
      }
      if (conteudo) {
        query.conteudo = { $regex: conteudo, $options: "i" };
      }
      try {
        const posts = await this.post_model.search(query);
        res.json(posts);
      } catch (error) {
        res.status(500).json({ error: "Erro ao buscar posts por pesquisa." });
      }
      return;
    };
    this.getByDate = async (req, res) => {
      const { data } = req.params;
      try {
        const posts = await this.post_model.findByDate(data);
        res.json(posts);
      } catch (error) {
        res.status(500).json({ error: "Erro ao buscar posts por data." });
      }
    };
    this.create = async (req, res) => {
      try {
        const post = await this.post_model.create(req.body);
        res.status(201).json(post);
      } catch (error) {
        res.status(500).json({ error: "Erro ao criar post." });
      }
    };
    this.update = async (req, res) => {
      const { id } = req.params;
      try {
        const post = await this.post_model.update(id, req.body);
        if (!post) {
          res.status(404).json({ error: "Post n\xE3o encontrado para atualizar." });
          return;
        }
        res.json(post);
      } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar post." });
      }
    };
    this.delete = async (req, res) => {
      const { id } = req.params;
      try {
        const result = await this.post_model.delete(id);
        if (!result) {
          res.status(404).json({ error: `Post ${id} n\xE3o encontrado para deletar.` });
          return;
        }
        res.json({ message: `Post id: ${id} deletado com sucesso.` });
      } catch (error) {
        res.status(500).json({ error: "Erro ao deletar post." });
      }
    };
    this.post_model = post_model;
  }
};

// src/models/Post.ts
var import_mongoose = require("mongoose");

// src/schemas/Post.ts
var import_zod = require("zod");
var postSchema = import_zod.z.object({
  titulo: import_zod.z.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio"),
  conteudo: import_zod.z.string().min(1, "Conte\xFAdo \xE9 obrigat\xF3rio"),
  autor: import_zod.z.string().min(1, "Autor \xE9 obrigat\xF3rio")
});
var partialPostSchema = postSchema.partial();

// src/models/Post.ts
var PostModel = class {
  constructor(database) {
    const schema = new import_mongoose.Schema({
      titulo: { type: String, required: true },
      conteudo: { type: String, required: true },
      autor: { type: String, required: true },
      data_criacao: { type: String, required: true },
      data_atualizacao: { type: String }
    }, {
      versionKey: false
    });
    const instance = database.getInstance();
    this.model = instance.model("Post", schema);
    if (instance.models.Post) {
      this.model = instance.model("Post");
    }
  }
  async findAll() {
    return await this.model.find().exec();
  }
  async search(query) {
    return await this.model.find(query).exec();
  }
  async findByDate(date) {
    const [year, month, day] = date.split("-");
    const brDate = `${day}/${month}/${year}`;
    return await this.model.find({ data_criacao: brDate }).exec();
  }
  async findById(id) {
    return await this.model.findById(id).exec();
  }
  async create(data) {
    const result = postSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.issues.map((e) => e.message).join("; "));
    }
    const post = new this.model({
      ...result.data,
      data_criacao: this.getDataAtual()
    });
    return await post.save();
  }
  async update(id, data) {
    const result = partialPostSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.issues.map((e) => e.message).join("; "));
    }
    const updateData = {
      ...result.data,
      data_atualizacao: this.getDataAtual()
    };
    return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
  async delete(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }
  getDataAtual() {
    return (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR");
  }
};

// src/providers/Database.ts
var import_mongoose2 = __toESM(require("mongoose"));
var import_dotenv = __toESM(require("dotenv"));
var _Database = class _Database {
  constructor() {
    import_dotenv.default.config();
  }
  async conectar() {
    if (_Database.instance) {
      return _Database.instance;
    }
    await import_mongoose2.default.connect(process.env.MONGODB_URI);
    console.log("Conectado ao MongoDB Atlas");
    _Database.instance = import_mongoose2.default;
    return _Database.instance;
  }
  getInstance() {
    if (!_Database.instance) {
      throw new Error("Banco n\xE3o conectado ainda!");
    }
    return _Database.instance;
  }
};
_Database.instance = null;
var Database = _Database;
var Database_default = Database;

// src/middlewares/Auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_dotenv2 = __toESM(require("dotenv"));
import_dotenv2.default.config();
var SECRET = process.env.JWT_SECRET;
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!SECRET) {
    res.status(500).json({ error: "JWT_SECRET n\xE3o configurado no ambiente." });
    return;
  }
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    import_jsonwebtoken.default.verify(token, SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: "Token inv\xE1lido ou expirado." });
        return;
      }
      next();
    });
  } else {
    res.status(401).json({ error: "Token de autentica\xE7\xE3o n\xE3o fornecido." });
  }
}

// src/routes/Posts.ts
async function createRouter() {
  const router = (0, import_express.Router)();
  const database = new Database_default();
  await database.conectar();
  const post_model = new PostModel(database);
  const controller = new Post(post_model);
  router.get("/", controller.getAll);
  router.get("/search", controller.search);
  router.get("/date/:data", controller.getByDate);
  router.get("/:id", controller.getById);
  router.post("/", authenticateJWT, controller.create);
  router.put("/:id", authenticateJWT, controller.update);
  router.delete("/:id", authenticateJWT, controller.delete);
  return router;
}
var Posts_default = createRouter;

// index.ts
var import_swagger_ui_express = __toESM(require("swagger-ui-express"));

// src/config/Swagger.ts
var import_fs = __toESM(require("fs"));
var import_js_yaml = __toESM(require("js-yaml"));
var import_path = __toESM(require("path"));
var swaggerPath = import_path.default.join(__dirname, "./swagger.yaml");
var swaggerDocument = import_js_yaml.default.load(import_fs.default.readFileSync(swaggerPath, "utf8"));
var Swagger_default = swaggerDocument;

// index.ts
var app = (0, import_express2.default)();
app.use(import_express2.default.json());
import_dotenv3.default.config();
async function init() {
  const router = await Posts_default();
  const porta = process.env.PORT || 3e3;
  app.use("/posts", router);
  app.use("/", import_swagger_ui_express.default.serve, import_swagger_ui_express.default.setup(Swagger_default));
  app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
  });
}
init();
