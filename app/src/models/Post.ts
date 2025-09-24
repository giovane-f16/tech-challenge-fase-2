import { Schema, Model, Document } from "mongoose";
import { postSchema, partialPostSchema } from "../schemas/Post";
import Database from "../providers/Database";

export interface Post extends Document {
    titulo: string;
    conteudo: string;
    autor: string;
    data_criacao: Date;
    data_atualizacao?: Date;
    thumbnail?: string
}

export class PostModel {
    private model: Model<Post>;

    constructor(database: Database) {
        const schema = new Schema<Post>({
            titulo: { type: String, required: true },
            conteudo: { type: String, required: true },
            autor: { type: String, required: true },
            data_criacao: { type: Date, required: true },
            data_atualizacao: { type: Date },
            thumbnail: { type: String}
        }, {
            versionKey: false
        });

        const instance = database.getInstance();

        this.model = instance.model<Post>("Post", schema);
        if (instance.models.Post) {
            this.model = instance.model<Post>("Post");
        }
    }

    async findAll() {
        return await this.model.find().sort({ data_criacao: -1 }).lean().exec();
    }

    async search(search: string) {
        return await this.model.find({
            $or: [
                { titulo: { $regex: search, $options: "i" } },
                { conteudo: { $regex: search, $options: "i" } },
                { autor: { $regex: search, $options: "i" } }
            ]
        }).exec();
    }

    async findByDate(date: string) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        return await this.model.find({
            data_criacao: { $gte: start, $lte: end }
        }).exec();
    }

    async findById(id: string) {
        return await this.model.findById(id).lean().exec();
    }

    async create(data: any) {
        const result = postSchema.safeParse(data);
        if (!result.success) {
            throw new Error(result.error.issues.map(e => e.message).join("; "));
        }

        const post = new this.model({
            ...result.data,
            data_criacao: new Date()
        });
        return await post.save();
    }

    async update(id: string, data: any) {
        const result = partialPostSchema.safeParse(data);
        if (!result.success) {
            throw new Error(result.error.issues.map(e => e.message).join("; "));
        }

        const updateData = {
            ...result.data,
            data_atualizacao: new Date().toISOString()
        };

        return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string) {
        return await this.model.findByIdAndDelete(id).exec();
    }
}