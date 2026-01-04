import Rating, { RatingData } from './rating.model';
import { RatingCreateDto } from './dto/RatingCreateDto';
import { RatingQueryDto } from './dto/RatingQueryDto';
import mongoose from 'mongoose';

export const create = async (
    ratingData: RatingCreateDto
): Promise<string> => {
    const rating = await new Rating({
        ...ratingData,
        movieId: new mongoose.Types.ObjectId(ratingData.movieId),
    }).save();
    return rating._id.toString();
};

export const findByMovieId = async (
    query: RatingQueryDto
): Promise<RatingData[]> => {
    const { movieId, skip, limit } = query;

    return Rating.find({
        movieId: new mongoose.Types.ObjectId(movieId)
    })
        .sort({ ratingDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
};

export const countByMovieIds = async (
    movieIds: string[]
): Promise<Record<string, number>> => {
    const objectIds = movieIds.map(id => new mongoose.Types.ObjectId(id));

    const result = await Rating.aggregate([
        {
            $match: {
                movieId: { $in: objectIds },
            },
        },
        {
            $group: {
                _id: '$movieId',
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                movieId: { $toString: '$_id' },
                count: 1,
            },
        },
    ]);

    const counts: Record<string, number> = {};
    movieIds.forEach(id => {
        counts[id] = 0;
    });

    result.forEach(item => {
        counts[item.movieId] = item.count;
    });

    return counts;
};

export const getAverageRating = async (
    movieId: string
): Promise<{ average: number; count: number }> => {
    const result = await Rating.aggregate([
        {
            $match: {
                movieId: new mongoose.Types.ObjectId(movieId),
            },
        },
        {
            $group: {
                _id: '$movieId',
                average: { $avg: '$score' },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                average: { $round: ['$average', 2] },
                count: 1,
            },
        },
    ]);

    if (result.length === 0) {
        return { average: 0, count: 0 };
    }

    return result[0];
};

export const existsByMovieId = async (movieId: string): Promise<boolean> => {
    const count = await Rating.countDocuments({
        movieId: new mongoose.Types.ObjectId(movieId)
    });
    return count > 0;
};