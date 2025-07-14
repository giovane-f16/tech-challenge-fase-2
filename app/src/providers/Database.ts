import mongoose from "mongoose";
import dotenv from "dotenv";

export class Database {
    private static instance: typeof mongoose | null = null;

    constructor() {
        dotenv.config();
    }

    async conectar() {
        if (Database.instance) {
            return Database.instance;
        }

        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Conectado ao MongoDB Atlas");
        Database.instance = mongoose;

        return Database.instance;
    }

    getInstance() {
        if (!Database.instance) {
            throw new Error("Banco não conectado ainda!");
        }
        return Database.instance;
    }
}

export default Database;