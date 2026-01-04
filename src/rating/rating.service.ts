import { RatingCreateDto } from './dto/RatingCreateDto';
import { RatingDto } from './dto/RatingDto';
import { RatingQueryDto } from './dto/RatingQueryDto';
import * as ratingRepository from './rating.repository';
import * as movieService from '../movie/movie.service';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from '../exceptions/ValidationException';
import { NotFoundException } from '../exceptions/NotFoundException';
import { isIdValid } from '../common/validators/validateDocumentId';

export const create = async (
    createDto: RatingCreateDto
): Promise<string> => {
    await validateMovieId(createDto.movieId);

    const ratingData = {
        ...createDto,
        ratingDate: createDto.ratingDate || new Date(),
    };

    return ratingRepository.create(ratingData);
};

export const findByMovieId = async (
    query: RatingQueryDto
): Promise<RatingDto[]> => {
    const { movieId } = query;

    if (!isIdValid(movieId)) {
        throw new ValidationException(`Movie id ${movieId} is invalid`);
    }

    const ratings = await ratingRepository.findByMovieId(query);
    return ratings.map((rating) =>
        plainToInstance(RatingDto, rating, { excludeExtraneousValues: true })
    );
};

export const countByMovieIds = async (
    movieIds: string[]
): Promise<Record<string, number>> => {
    const invalidIds = movieIds.filter(id => !isIdValid(id));
    if (invalidIds.length > 0) {
        throw new ValidationException(
            `Invalid movie ids: ${invalidIds.join(', ')}`
        );
    }
    return ratingRepository.countByMovieIds(movieIds);
};

export const getAverageRating = async (
    movieId: string
): Promise<{ average: number; count: number }> => {
    if (!isIdValid(movieId)) {
        throw new ValidationException(`Movie id ${movieId} is invalid`);
    }

    return ratingRepository.getAverageRating(movieId);
};

export const validateMovieId = async (movieId: string): Promise<void> => {
    if (!isIdValid(movieId)) {
        throw new ValidationException(`Movie id ${movieId} is invalid`);
    }

    const movieExists = await movieService.exists(movieId);
    if (!movieExists) {
        throw new ValidationException(`Movie with id ${movieId} doesn't exists.`);
    }
};