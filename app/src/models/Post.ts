import { Schema, Model, Document } from "mongoose";
import { postSchema, partialPostSchema } from "../schemas/Post";
import Database from "../providers/Database";

export interface Post extends Document {
    titulo: string;
    conteudo: string;
    autor: string;
    data_criacao: string;
    data_atualizacao?: string;
}

export class PostModel {
    private model: Model<Post>;

    constructor(database: Database) {
        const schema = new Schema<Post>({
            titulo: { type: String, required: true },
            conteudo: { type: String, required: true },
            autor: { type: String, required: true },
            data_criacao: { type: String, required: true },
            data_atualizacao: { type: String }
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
        const posts = await this.model.find().exec();

        const parseDate = (dateString: string) => {
            const [day, month, year] = dateString.split('/');
            return new Date(`${year}-${month}-${day}`);
        };

        const sortedPosts = posts.sort((a, b) => {
            return parseDate(b.data_criacao).getTime() - parseDate(a.data_criacao).getTime();
        });

        return sortedPosts;
    }

    async search(query: any) {
        return await this.model.find(query).exec();
    }

    async findByDate(date: string) {
        // Assume data_criacao é string no formato 'YYYY-MM-DD'
        const [year, month, day] = date.split("-");
        const brDate = `${day}/${month}/${year}`;
        return await this.model.find({ data_criacao: brDate }).exec();
    }

    async findById(id: string) {
        return await this.model.findById(id).exec();
    }

    async create(data: any) {
        const result = postSchema.safeParse(data);
        if (!result.success) {
            throw new Error(result.error.issues.map(e => e.message).join("; "));
        }

        const post = new this.model({
            ...result.data,
            data_criacao: this.getDataAtual()
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
            data_atualizacao: this.getDataAtual()
        };

        return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string) {
        return await this.model.findByIdAndDelete(id).exec();
    }

    getDataAtual(): string {
        return new Date().toLocaleDateString("pt-BR");
    }
}