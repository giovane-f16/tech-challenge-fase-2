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
      const searchTerm = req.query.titulo || req.query.autor || req.query.conteudo;
      try {
        const posts = await this.post_model.search(searchTerm);
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
    this.getThumbnail = async (req, res) => {
      const { id } = req.params;
      try {
        const upload = await this.post_model.getThumbnail(id);
        if (!upload) {
          res.status(404).json({ error: "Thumbnail n\xE3o encontrada para este post." });
          return;
        }
        res.set("Content-Type", upload.contentType);
        res.set("Content-Length", upload.size.toString());
        res.send(upload.data);
      } catch (error) {
        res.status(500).json({ error: "Erro ao buscar thumbnail." });
      }
    };
    this.post_model = post_model;
  }
};

// src/models/Post.ts
var import_mongoose2 = require("mongoose");

// src/schemas/Post.ts
var import_zod = require("zod");
var postSchema = import_zod.z.object({
  titulo: import_zod.z.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio"),
  conteudo: import_zod.z.string().min(1, "Conte\xFAdo \xE9 obrigat\xF3rio"),
  autor: import_zod.z.string().min(1, "Autor \xE9 obrigat\xF3rio"),
  thumbnail: import_zod.z.string().optional(),
  thumbnail_buffer: import_zod.z.instanceof(Buffer).optional()
});
var partialPostSchema = postSchema.partial();

// src/models/Upload.ts
var import_mongoose = require("mongoose");
var UploadModel = class {
  constructor(database) {
    const schema = new import_mongoose.Schema({
      filename: { type: String, required: true },
      data: { type: Buffer, required: true },
      contentType: { type: String, required: true },
      size: { type: Number, required: true },
      uploadDate: { type: Date, default: Date.now }
    }, {
      versionKey: false,
      collection: "uploads"
    });
    const instance = database.getInstance();
    if (instance.models.Upload) {
      this.model = instance.model("Upload");
    } else {
      this.model = instance.model("Upload", schema);
    }
  }
  async create(data, contentType, filename) {
    const upload = new this.model({
      filename,
      data,
      contentType,
      size: data.length,
      uploadDate: /* @__PURE__ */ new Date()
    });
    return await upload.save();
  }
  async findById(id) {
    return await this.model.findById(id).exec();
  }
  async delete(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }
};

// src/models/Post.ts
var PostModel = class {
  constructor(database) {
    this.uploadModel = new UploadModel(database);
    const schema = new import_mongoose2.Schema({
      titulo: { type: String, required: true },
      conteudo: { type: String, required: true },
      autor: { type: String, required: true },
      data_criacao: { type: Date, required: true },
      data_atualizacao: { type: Date },
      thumbnail: { type: String },
      thumbnail_id: { type: import_mongoose2.Schema.Types.ObjectId, ref: "Upload" }
    }, {
      versionKey: false
    });
    const instance = database.getInstance();
    if (instance.models.Post) {
      this.model = instance.model("Post");
    } else {
      this.model = instance.model("Post", schema);
    }
  }
  async findAll() {
    return await this.model.find().sort({ data_criacao: -1 }).lean().exec();
  }
  async search(search) {
    return await this.model.find({
      $or: [
        { titulo: { $regex: search, $options: "i" } },
        { conteudo: { $regex: search, $options: "i" } },
        { autor: { $regex: search, $options: "i" } }
      ]
    }).exec();
  }
  async findByDate(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return await this.model.find({
      data_criacao: { $gte: start, $lte: end }
    }).exec();
  }
  async findById(id) {
    return await this.model.findById(id).lean().exec();
  }
  async create(data) {
    const result = postSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.issues.map((e) => e.message).join("; "));
    }
    let thumbnailId;
    let thumbnailToSave = result.data.thumbnail;
    if (result.data.thumbnail && result.data.thumbnail.trim() !== "") {
      if (result.data.thumbnail.startsWith("data:image/")) {
        thumbnailId = await this.processarThumbnail(result.data.thumbnail);
        thumbnailToSave = void 0;
      }
    }
    const post = new this.model({
      titulo: result.data.titulo,
      conteudo: result.data.conteudo,
      autor: result.data.autor,
      data_criacao: /* @__PURE__ */ new Date(),
      thumbnail: thumbnailToSave,
      thumbnail_id: thumbnailId
    });
    return await post.save();
  }
  async update(id, data) {
    const result = partialPostSchema.safeParse(data);
    if (!result.success) {
      throw new Error(result.error.issues.map((e) => e.message).join("; "));
    }
    const oldPost = await this.model.findById(id);
    let thumbnailId;
    const updateData = {
      ...result.data,
      data_atualizacao: /* @__PURE__ */ new Date()
    };
    if (result.data.thumbnail && result.data.thumbnail.trim() !== "") {
      if (result.data.thumbnail.startsWith("data:image/")) {
        thumbnailId = await this.processarThumbnail(result.data.thumbnail);
        if (oldPost?.thumbnail_id) {
          await this.uploadModel.delete(oldPost.thumbnail_id.toString());
        }
        updateData.thumbnail = void 0;
        updateData.thumbnail_id = thumbnailId;
      }
    }
    return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
  async delete(id) {
    const post = await this.model.findById(id);
    if (post?.thumbnail_id) {
      await this.uploadModel.delete(post.thumbnail_id.toString());
    }
    return await this.model.findByIdAndDelete(id).exec();
  }
  async getThumbnail(id) {
    const post = await this.model.findById(id);
    if (!post || !post.thumbnail_id) {
      return null;
    }
    return await this.uploadModel.findById(post.thumbnail_id.toString());
  }
  async processarThumbnail(thumbnail) {
    if (!thumbnail || thumbnail.trim() === "") {
      return void 0;
    }
    try {
      if (!thumbnail.startsWith("data:image/")) {
        throw new Error("Thumbnail deve ser uma imagem em formato base64");
      }
      const base64Data = thumbnail.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");
      const contentType = thumbnail.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
      const filename = `thumbnail_${Date.now()}.${contentType.split("/")[1]}`;
      const upload = await this.uploadModel.create(imageBuffer, contentType, filename);
      return upload._id;
    } catch (error) {
      console.error("Erro ao processar thumbnail:", error);
      throw new Error("Falha ao processar a imagem thumbnail");
    }
  }
};

// src/providers/Database.ts
var import_mongoose3 = __toESM(require("mongoose"));
var import_dotenv = __toESM(require("dotenv"));
var _Database = class _Database {
  constructor() {
    import_dotenv.default.config();
  }
  async conectar() {
    if (_Database.instance) {
      return _Database.instance;
    }
    await import_mongoose3.default.connect(process.env.MONGODB_URI);
    console.log("Conectado ao MongoDB Atlas");
    _Database.instance = import_mongoose3.default;
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
  router.get("/:id/thumbnail", controller.getThumbnail);
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
app.use(import_express2.default.json({ limit: "50mb" }));
app.use(import_express2.default.urlencoded({ limit: "50mb", extended: true }));
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
