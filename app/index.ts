import express from "express";
import dotenv from "dotenv";
import createRouter from "./src/routes/Posts";
import swaggerUi, { JsonObject } from "swagger-ui-express";
import swaggerDocument from "./src/config/Swagger";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

dotenv.config();

async function init() {
    const router = await createRouter();
    const porta = process.env.PORT || 3000;

    app.use("/posts", router);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument as JsonObject));

    app.get("/", (req, res) => {
        res.redirect("/api-docs");
    });

    app.listen(porta, () => {
        console.log(`Servidor rodando em http://localhost:${porta}`);
        console.log(`Documentação Swagger em http://localhost:${porta}/api-docs`);
    });
}

init();