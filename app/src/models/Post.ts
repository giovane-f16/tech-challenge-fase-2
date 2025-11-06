import { Schema, Model, Document, Types } from "mongoose";
import { postSchema, partialPostSchema } from "../schemas/Post";
import Database from "../providers/Database";
import { UploadModel } from "./Upload";

export interface Post extends Document {
    titulo: string;
    conteudo: string;
    autor: string;
    data_criacao: Date;
    data_atualizacao?: Date;
    thumbnail?: string;
    thumbnail_id?: Types.ObjectId;
}

export class PostModel {
    private model: Model<Post>;
    private uploadModel: UploadModel;

    constructor(database: Database) {
        this.uploadModel = new UploadModel(database);

        const schema = new Schema<Post>({
            titulo: { type: String, required: true },
            conteudo: { type: String, required: true },
            autor: { type: String, required: true },
            data_criacao: { type: Date, required: true },
            data_atualizacao: { type: Date },
            thumbnail: { type: String },
            thumbnail_id: { type: Schema.Types.ObjectId, ref: 'Upload' }
        }, {
            versionKey: false
        });

        const instance = database.getInstance();

        if (instance.models.Post) {
            this.model = instance.model<Post>("Post");
        } else {
            this.model = instance.model<Post>("Post", schema);
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

        const { thumbnailId, thumbnailToSave } = await this.handleThumbnailProcessing(result.data.thumbnail);

        const post = new this.model({
            titulo: result.data.titulo,
            conteudo: result.data.conteudo,
            autor: result.data.autor,
            data_criacao: new Date(),
            thumbnail: thumbnailToSave,
            thumbnail_id: thumbnailId
        });
        return await post.save();
    }

    async update(id: string, data: any) {
        const result = partialPostSchema.safeParse(data);
        if (!result.success) {
            throw new Error(result.error.issues.map(e => e.message).join("; "));
        }

        const oldPost = await this.model.findById(id);

        const updateData: any = {
            ...result.data,
            data_atualizacao: new Date()
        };

        const { thumbnailId } = await this.handleThumbnailProcessing(
            result.data.thumbnail,
            oldPost?.thumbnail_id
        );

        if (thumbnailId) {
            updateData.thumbnail = undefined;
            updateData.thumbnail_id = thumbnailId;
        }

        return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string) {
        const post = await this.model.findById(id);

        if (post?.thumbnail_id) {
            await this.uploadModel.delete(post.thumbnail_id.toString());
        }

        return await this.model.findByIdAndDelete(id).exec();
    }

    async getThumbnail(id: string) {
        const post = await this.model.findById(id);
        if (!post || !post.thumbnail_id) {
            return null;
        }
        return await this.uploadModel.findById(post.thumbnail_id.toString());
    }

    private async handleThumbnailProcessing(
        thumbnail: string | undefined,
        oldThumbnailId?: Types.ObjectId
    ): Promise<{ thumbnailId?: Types.ObjectId; thumbnailToSave?: string }> {
        let thumbnailId: Types.ObjectId | undefined;
        let thumbnailToSave = thumbnail;

        if (thumbnail && thumbnail.trim() !== "") {
            if (thumbnail.startsWith('data:image/')) {
                thumbnailId = await this.processarThumbnail(thumbnail);
                thumbnailToSave = undefined;

                // Delete old thumbnail if updating
                if (oldThumbnailId) {
                    await this.uploadModel.delete(oldThumbnailId.toString());
                }
            }
        }

        return { thumbnailId, thumbnailToSave };
    }

    private async processarThumbnail(thumbnail: string): Promise<Types.ObjectId | undefined> {
        if (!thumbnail || thumbnail.trim() === "") {
            return undefined;
        }

        try {
            if (!thumbnail.startsWith('data:image/')) {
                throw new Error('Thumbnail deve ser uma imagem em formato base64');
            }

            const base64Data = thumbnail.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            const contentType = thumbnail.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
            const filename = `thumbnail_${Date.now()}.${contentType.split('/')[1]}`;

            const upload = await this.uploadModel.create(imageBuffer, contentType, filename);

            return upload._id as Types.ObjectId;
        } catch (error) {
            console.error('Erro ao processar thumbnail:', error);
            throw new Error('Falha ao processar a imagem thumbnail');
        }
    }
}