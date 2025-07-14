import { Schema, Model, Document } from "mongoose";
import Database from "../providers/Database";

export interface Post extends Document {
    titulo: string;
    conteudo: string;
    autor: string;
    data_criacao: string;
    data_atualizacao?: Date;
}

export class PostModel {
    private model: Model<Post>;

    constructor(database: Database) {
        const schema = new Schema<Post>({
            titulo:           { type: String, required: true },
            conteudo:         { type: String, required: true },
            autor:            { type: String, required: true },
            data_criacao:     { type: String, required: true },
            data_atualizacao: { type: Date, default: Date.now }
        });

        const instance = database.getInstance();

        // CORREÇÃO: verifica se já existe
		this.model = instance.model<Post>("Post", schema);

        if (instance.models.Post) {
            this.model = instance.model<Post>("Post");
        }
    }

    async findAll() {
        return await this.model.find().exec();
    }
}