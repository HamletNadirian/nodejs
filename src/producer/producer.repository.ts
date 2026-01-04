import Producer, {ProducerData} from './producer.model';
import {ProducerCreateDto} from './dto/ProducerCreateDto';
import mongoose from 'mongoose';
import Movie from '../movie/movie.model';

export const create = async (producerData: ProducerCreateDto): Promise<string> => {
    const producer = await new Producer(producerData).save();
    return producer._id.toString();
}
/*export const create = async ({
                                 name,
                                 country,
                                 foundedYear,
                                 website,
                                 bio
                             }: ProducerCreateDto): Promise<string> => {
    const producer = await new Producer
    ({
        country,
        foundedYear,
        website,
        bio
    }).save();
    return producer._id.toString();
};*/
export const getById = async (id: string): Promise<ProducerData | null> => {
    return Producer.findById(id).lean();
};

export const getAll = async (skip: number = 0, limit: number = 10): Promise<ProducerData[]> => {
    return Producer.find({})
        .skip(skip)
        .limit(limit)
        .sort({createdAt: -1})
        .lean();
};

export const update = async (
    id: string,
    producerData: Partial<ProducerCreateDto>
): Promise<void> => {
    await Producer.findByIdAndUpdate(id, {$set: producerData});
};

export const remove = async (id: string): Promise<void> => {
    await Producer.findByIdAndDelete(id);
};

export const exists = async (id: string): Promise<boolean> => {
    return !!(await Producer.exists({_id: id}));
};

export const hasMovies = async (producerId: string): Promise<boolean> => {
    const count = await Movie.countDocuments({
        producerId: new mongoose.Types.ObjectId(producerId)
    });
    return count > 0;
};