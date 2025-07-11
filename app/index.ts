import express, { Request, Response } from "express";
import postsRoutes from "./src/routes/Posts";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "hello world with Typescript!!" });
});

app.use("/posts", postsRoutes);

app.listen(3000, () => console.log("server running on port 3000"));
