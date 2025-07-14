import express from "express";
import dotenv from "dotenv";
import createRouter from "./src/routes/Posts";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Postech rodando!");
});

dotenv.config();

async function init() {
	const router = await createRouter();
	const porta = process.env.PORT || 3000;

	app.use("/posts", router);
	app.listen(porta, () => {
		console.log(`Servidor rodando em http://localhost:${porta}`);
	});
}

init();