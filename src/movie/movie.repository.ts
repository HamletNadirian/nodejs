import Movie, {MovieData} from "./movie.model";
import {MovieCreateDto} from "./dto/MovieCreateDto";

import mongoose from "mongoose";

export const create = async (movieData: MovieCreateDto): Promise<string> => {
    const movie = await new Movie({
        ...movieData,
        producerId: new mongoose.Types.ObjectId(movieData.producerId),
    }).save();
    return movie._id.toString();
};

export const getById = async (id: string): Promise<MovieData | null> => {
    return Movie.findById(id).lean();
};

export const getAll = async (skip: number = 0, limit: number = 10)
    : Promise<MovieData[]> => {
    return Movie.find({})
        .skip(skip)
        .limit(limit)
        .sort({createdAt: -1})
        .lean()
};
export const update = async (
    id: string,
    movieData: Partial<MovieCreateDto>
): Promise<void> => {
    const updateData: any = {...movieData};

    if (movieData.producerId) {
        updateData.producerId = new mongoose.Types.ObjectId(movieData.producerId);
    }

    await Movie.findByIdAndUpdate(id, {$set: updateData});
};
export const remove = async (id: string): Promise<void> => {
    await Movie.findByIdAndDelete(id);
};

export const exists = async (id: string): Promise<boolean> => {
    return !!(await Movie.exists({_id: id}));
};