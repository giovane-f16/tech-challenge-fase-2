import express, { Request, Response } from "express";
import postsRoutes from "./src/routes/Posts";

const app = express();
app.use(express.json());

app.use("/posts", postsRoutes);

app.listen(3000, () => {
	console.log("Servidor rodando em http://localhost:3000");
});