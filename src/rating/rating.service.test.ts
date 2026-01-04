import 'reflect-metadata';
import * as ratingService from './rating.service';
import * as ratingRepository from './rating.repository';
import * as movieService from '../movie/movie.service';
import mongoose from 'mongoose';
import {ValidationException} from '../exceptions/ValidationException';
import {plainToInstance} from 'class-transformer';
import {RatingCreateDto} from './dto/RatingCreateDto';
import {RatingQueryDto} from './dto/RatingQueryDto';

describe('Rating Service', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe('create', () => {
        test('should create a rating', async () => {
            const ratingId = new mongoose.Types.ObjectId().toString();
            const movieId = new mongoose.Types.ObjectId().toString();
            const createDto = plainToInstance(RatingCreateDto, {
                movieId,
                score: 8,
                comment: 'Хороший фильм',
                createdBy: 'Иван Иванов',
            });

            jest.spyOn(movieService, 'exists').mockResolvedValueOnce(true);
            jest.spyOn(ratingRepository, 'create').mockResolvedValueOnce(ratingId);

            const result = await ratingService.create(createDto);
            expect(result).toBe(ratingId);
            expect(movieService.exists).toHaveBeenCalledWith(movieId);
            expect(ratingRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    movieId,
                    score: 8,
                    comment: 'Хороший фильм',
                })
            );
        });

        test('should throw when movie does not exist', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            const createDto = plainToInstance(RatingCreateDto, {
                movieId,
                score: 8,
            });

            jest.spyOn(movieService, 'exists').mockResolvedValueOnce(false);

            await expect(ratingService.create(createDto)).rejects.toThrow(
                ValidationException
            );
        });

        test('should validate movieId format', async () => {
            const createDto = plainToInstance(RatingCreateDto, {
                movieId: 'invalid-id',
                score: 8,
            });

            await expect(ratingService.create(createDto)).rejects.toMatchObject({
                errors: expect.arrayContaining(['Movie id invalid-id is invalid']),
            });
        });

        test('should set ratingDate to current date if not provided', async () => {
            const ratingId = new mongoose.Types.ObjectId().toString();
            const movieId = new mongoose.Types.ObjectId().toString();
            const createDto = plainToInstance(RatingCreateDto, {
                movieId,
                score: 8,
            });

            jest.spyOn(movieService, 'exists').mockResolvedValueOnce(true);
            const createSpy = jest.spyOn(ratingRepository, 'create').mockResolvedValueOnce(ratingId);

            await ratingService.create(createDto);

            expect(createSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    ratingDate: expect.any(Date),
                })
            );
        });
    });

    describe('findByMovieId', () => {
        test('should return ratings for movie', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            const query = plainToInstance(RatingQueryDto, {
                movieId,
                skip: 0,
                limit: 10,
            });
            const ratings = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    movieId: new mongoose.Types.ObjectId(movieId),
                    score: 8,
                    comment: 'Хороший фильм',
                    createdBy: 'Иван',
                    createdAt: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    movieId: new mongoose.Types.ObjectId(movieId),
                    score: 9,
                    comment: 'Отлично!',
                    createdBy: 'Мария',
                    createdAt: new Date(),
                },
            ];

            jest.spyOn(ratingRepository, 'findByMovieId').mockResolvedValueOnce(ratings as any);

            const result = await ratingService.findByMovieId(query);
            expect(result).toHaveLength(2);
            expect(result[0].score).toBe(8);
            expect(result[1].score).toBe(9);
            expect(ratingRepository.findByMovieId).toHaveBeenCalledWith(query);
        });

        test('should validate movieId format', async () => {
            const query = plainToInstance(RatingQueryDto, {
                movieId: 'invalid-id',
                skip: 0,
                limit: 10,
            });

            await expect(ratingService.findByMovieId(query)).rejects.toMatchObject({
                errors: expect.arrayContaining(['Movie id invalid-id is invalid']),
            });
        });

        test('should return empty list when no ratings', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            const query = plainToInstance(RatingQueryDto, {
                movieId,
                skip: 0,
                limit: 10,
            });

            jest.spyOn(ratingRepository, 'findByMovieId').mockResolvedValueOnce([]);

            const result = await ratingService.findByMovieId(query);
            expect(result).toHaveLength(0);
            expect(ratingRepository.findByMovieId).toHaveBeenCalledWith(query);
        });
    });

    describe('countByMovieIds', () => {
        test('should return rating counts for movies', async () => {
            const movieId1 = new mongoose.Types.ObjectId().toString();
            const movieId2 = new mongoose.Types.ObjectId().toString();
            const movieIds = [movieId1, movieId2];
            const counts = {
                [movieId1]: 5,
                [movieId2]: 3,
            };

            jest.spyOn(ratingRepository, 'countByMovieIds').mockResolvedValueOnce(counts);

            const result = await ratingService.countByMovieIds(movieIds);
            expect(result).toEqual(counts);
            expect(ratingRepository.countByMovieIds).toHaveBeenCalledWith(movieIds);
        });

        test('should validate movieIds array', async () => {
            const movieIds = ['valid-id-1', 'invalid-id', 'valid-id-2'];

            await expect(ratingService.countByMovieIds(movieIds)).rejects.toMatchObject({
                errors: expect.arrayContaining([
                    expect.stringContaining('invalid-id')
                ]),
            });
        });

        test('should return zero counts for movies without ratings', async () => {
            const movieId1 = new mongoose.Types.ObjectId().toString();
            const movieId2 = new mongoose.Types.ObjectId().toString();
            const movieIds = [movieId1, movieId2];
            const counts = {
                [movieId1]: 0,
                [movieId2]: 0,
            };

            jest.spyOn(ratingRepository, 'countByMovieIds').mockResolvedValueOnce(counts);

            const result = await ratingService.countByMovieIds(movieIds);
            expect(result).toEqual(counts);
        });
    });

    describe('getAverageRating', () => {
        test('should return average rating for movie', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            const averageRating = {
                average: 8.5,
                count: 42,
            };

            jest.spyOn(ratingRepository, 'getAverageRating').mockResolvedValueOnce(averageRating);

            const result = await ratingService.getAverageRating(movieId);
            expect(result).toEqual(averageRating);
            expect(ratingRepository.getAverageRating).toHaveBeenCalledWith(movieId);
        });

        test('should validate movieId format', async () => {
            await expect(ratingService.getAverageRating('invalid-id')).rejects.toMatchObject({
                errors: expect.arrayContaining(['Movie id invalid-id is invalid']),
            });
        });

        test('should return zero for movie without ratings', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            const averageRating = {
                average: 0,
                count: 0,
            };

            jest.spyOn(ratingRepository, 'getAverageRating').mockResolvedValueOnce(averageRating);

            const result = await ratingService.getAverageRating(movieId);
            expect(result).toEqual(averageRating);
        });
    });

    describe('validateMovieId', () => {
        test('should not throw when movie exists', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            jest.spyOn(movieService, 'exists').mockResolvedValueOnce(true);

            await expect(ratingService.validateMovieId(movieId)).resolves.not.toThrow();
            expect(movieService.exists).toHaveBeenCalledWith(movieId);
        });

        test('should throw when movie does not exist', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            jest.spyOn(movieService, 'exists').mockResolvedValueOnce(false);

            await expect(ratingService.validateMovieId(movieId)).rejects.toMatchObject({
                errors: expect.arrayContaining([`Movie with id ${movieId} doesn't exists.`]),
            });
        });

        test('should throw when movieId is invalid', async () => {
            await expect(ratingService.validateMovieId('invalid-id')).rejects.toMatchObject({
                errors: expect.arrayContaining(['Movie id invalid-id is invalid']),
            });
        });
    });
});