import { Schema, Model, Document } from "mongoose";
import Database from "../providers/Database";

export interface Upload extends Document {
    filename: string;
    data: Buffer;
    contentType: string;
    size: number;
    uploadDate: Date;
}

export class UploadModel {
    private model: Model<Upload>;

    constructor(database: Database) {
        const schema = new Schema<Upload>({
            filename: { type: String, required: true },
            data: { type: Buffer, required: true },
            contentType: { type: String, required: true },
            size: { type: Number, required: true },
            uploadDate: { type: Date, default: Date.now }
        }, {
            versionKey: false,
            collection: 'uploads'
        });

        const instance = database.getInstance();

        if (instance.models.Upload) {
            this.model = instance.model<Upload>("Upload");
        } else {
            this.model = instance.model<Upload>("Upload", schema);
        }
    }

    async create(data: Buffer, contentType: string, filename: string): Promise<Upload> {
        const upload = new this.model({
            filename,
            data,
            contentType,
            size: data.length,
            uploadDate: new Date()
        });
        return await upload.save();
    }

    async findById(id: string): Promise<Upload | null> {
        return await this.model.findById(id).exec();
    }

    async delete(id: string): Promise<Upload | null> {
        return await this.model.findByIdAndDelete(id).exec();
    }
}

export default UploadModel;
