import mongoose, { Document, Schema } from 'mongoose';

export interface ProducerData {
    _id: mongoose.Types.ObjectId;
    name: string;
    country?: string;
    foundedYear?: number;
    website?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
}

const producerSchema = new Schema(
    {
        name: {
            required: true,
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 200,
        },
        country: {
            required: false,
            type: String,
            maxlength: 100,
        },
        foundedYear: {
            required: false,
            type: Number,
            min: 1800,
            max: new Date().getFullYear(),
        },
        website: {
            required: false,
            type: String,
            maxlength: 200,
            match: /^https?:\/\/.+/,
        },
        bio: {
            required: false,
            type: String,
            maxlength: 2000,
        },
    },
    {
        timestamps: true,
        timezone: 'UTC',
    }
);

type ProducerDocument = ProducerData & Document;

const Producer = mongoose.model<ProducerDocument>('Producer', producerSchema);

export default Producer;