import mongoose, { Document, Schema } from 'mongoose';
export interface RatingData {
    _id: mongoose.Types.ObjectId;
    movieId: mongoose.Types.ObjectId;
    score: number;
    comment?: string;
    ratingDate: Date;
    createdBy?: string;
    createdAt: Date;
}

export const MIN_RATING_SCORE = 1;
export const MAX_RATING_SCORE = 10;

const ratingSchema = new Schema(
    {
        movieId: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'Movie',
            index: true,
        },
        score: {
            required: true,
            type: Number,
            min: MIN_RATING_SCORE,
            max: MAX_RATING_SCORE,
        },
        comment: {
            required: false,
            type: String,
            maxlength: 500,
        },
        ratingDate: {
            required: false,
            type: Date,
            default: Date.now,
        },
        createdBy: {
            required: false,
            type: String,
            maxlength: 100,
        },
    },
    {
        timestamps: true,
        timezone: 'UTC',
    }
);

ratingSchema.index({ movieId: 1, ratingDate: -1 });

type RatingDocument = RatingData & Document;

const Rating = mongoose.model<RatingDocument>('Rating', ratingSchema);
export default Rating;