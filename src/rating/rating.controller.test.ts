import 'reflect-metadata';
import request = require('supertest');
import mongoose from 'mongoose';
import * as ratingService from './rating.service';
import * as movieService from '../movie/movie.service';
import app from '../app';

describe('Rating Controller', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe('POST /api/ratings', () => {
        test('Should create a rating', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const body = {
                movieId: new mongoose.Types.ObjectId().toString(),
                score: 8,
                comment: 'Отличный фильм!',
                createdBy: 'Иван Иванов',
            };

            jest.spyOn(ratingService, 'create').mockResolvedValueOnce(id);
            jest.spyOn(movieService, 'exists').mockResolvedValueOnce(true);

            const response = await request(app).post('/api/ratings').send(body);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id });
        });

        test('Should throw 400 when movie does not exist', async () => {
            const body = {
                movieId: new mongoose.Types.ObjectId().toString(),
                score: 8,
            };

            jest.spyOn(movieService, 'exists').mockResolvedValueOnce(false);

            const response = await request(app)
                .post('/api/ratings')
                .send(body);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                errors: [`Movie with id ${body.movieId} doesn't exists.`],
            });
        });

        test('Should validate required fields', async () => {
            const response = await request(app).post('/api/ratings').send({});
            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    'movieId should not be empty',
                    'movieId must be a string',
                    'score must not be greater than 10',
                    'score must not be less than 1',
                    'score must be an integer number',
                ])
            );
        });

        test('Should validate score range', async () => {
            const body = {
                movieId: new mongoose.Types.ObjectId().toString(),
                score: 15,
            };

            const response = await request(app).post('/api/ratings').send(body);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain(
                'score must not be greater than 10'
            );
        });

        test('Should validate comment length', async () => {
            const body = {
                movieId: new mongoose.Types.ObjectId().toString(),
                score: 8,
                comment: 'a'.repeat(501),
            };

            const response = await request(app).post('/api/ratings').send(body);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain(
                'comment must be shorter than or equal to 500 characters'
            );
        });
    });

    describe('GET /api/ratings', () => {
        test('Should return ratings by movieId', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            const ratings = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    movieId: new mongoose.Types.ObjectId(movieId),
                    score: 8,
                    comment: 'Хороший фильм',
                    createdBy: 'Алексей',
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

            jest.spyOn(ratingService, 'findByMovieId').mockResolvedValueOnce(ratings as any);

            const response = await request(app)
                .get('/api/ratings')
                .query({ movieId, from: 0, size: 10 });

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].score).toBe(8);
            expect(response.body[1].score).toBe(9);
        });

        test('Should validate movieId parameter', async () => {
            const response = await request(app)
                .get('/api/ratings')
                .query({ movieId: 'invalid-id' });

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Movie id invalid-id is invalid');
        });

        test('Should return empty list when no ratings', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            jest.spyOn(ratingService, 'findByMovieId').mockResolvedValueOnce([]);

            const response = await request(app)
                .get('/api/ratings')
                .query({ movieId });

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('POST /api/ratings/_counts', () => {
        test('Should return rating counts for movies', async () => {
            const movieId1 = new mongoose.Types.ObjectId().toString();
            const movieId2 = new mongoose.Types.ObjectId().toString();
            const body = {
                movieIds: [movieId1, movieId2],
            };
            const counts = {
                [movieId1]: 5,
                [movieId2]: 3,
            };

            jest.spyOn(ratingService, 'countByMovieIds').mockResolvedValueOnce(counts);

            const response = await request(app)
                .post('/api/ratings/_counts')
                .send(body);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(counts);
        });

        test('Should validate movieIds array', async () => {
            const response = await request(app)
                .post('/api/ratings/_counts')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('movieIds should not be empty');
        });

        test('Should validate invalid movie ids', async () => {
            const body = {
                movieIds: ['valid-id-1', 'invalid-id', 'valid-id-2'],
            };

            const response = await request(app)
                .post('/api/ratings/_counts')
                .send(body);

            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(expect.stringContaining('invalid-id'));

        });
    });

    describe('GET /api/ratings/:movieId/average', () => {
        test('Should return average rating for movie', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            const averageRating = {
                average: 8.5,
                count: 42,
            };

            jest.spyOn(ratingService, 'getAverageRating').mockResolvedValueOnce(averageRating);

            const response = await request(app)
                .get(`/api/ratings/${movieId}/average`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(averageRating);
        });

        test('Should return zero when no ratings', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            const averageRating = {
                average: 0,
                count: 0,
            };

            jest.spyOn(ratingService, 'getAverageRating').mockResolvedValueOnce(averageRating);

            const response = await request(app)
                .get(`/api/ratings/${movieId}/average`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(averageRating);
        });

        test('Should validate movieId format', async () => {
            const response = await request(app)
                .get('/api/ratings/invalid-id/average');

            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Movie id invalid-id is invalid');
        });
    });
});