import mongoose, {Document, Schema} from 'mongoose';


export const MAX_TITLE_LENGTH = 400;
export const MIN_TITLE_LENGTH = 1;

export const MAX_DESCRIPTION_LENGTH = 300;
export const MIN_RELEASE_YEAR = 1888;
export const MAX_RELEASE_YEAR = new Date().getFullYear() + 5;
export const MIN_DURATION = 1;
export const MAX_DURATION = 240;


export interface MovieData {
    _id: mongoose.Types.ObjectId;
    title: String;
    description?: String;
    releaseYear: number;
    duration: number;
    genre: String[];
    producerId: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const MovieSchema = new Schema({
        title: {
            required: true,
            type: String,
            trim: true,
            minlength: MIN_TITLE_LENGTH,
            maxlength: MAX_TITLE_LENGTH,
        },
        description: {
            required: false,
            type: String,
            maxlength: MAX_DESCRIPTION_LENGTH,
        },
        releaseYear: {
            required: true,
            type: Number,
            min: MIN_RELEASE_YEAR,
            max: MAX_RELEASE_YEAR,
        },
        duration: {
            required: true,
            type: Number,
            min: MIN_DURATION,
            max: MAX_DURATION,
        },
        genre: {
            required: true,
            type: [String],
            default: [],
        },
        producerId: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'Producer',
            index: true,
        },
    },
    {
        timestamps: true,
        timezone: 'UTC'
    }
);

type MovieDocument = MovieData & Document;

const Movie = mongoose.model<MovieDocument>('Movie', MovieSchema);
export default Movie;