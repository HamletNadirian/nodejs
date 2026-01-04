import 'reflect-metadata';
import request = require('supertest');
import mongoose from 'mongoose';
import * as movieService from './movie.service';
import * as producerService from '../producer/producer.service';
import app from '../app';
import { NotFoundException } from '../exceptions/NotFoundException';
describe('Movie Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
    describe('GET /api/movies/:id', () => {
        test('Should return a movie', async () => {
            const id = new mongoose.Types.ObjectId();
            const movie = {
                _id: id,
                title: 'Интерстеллар',
                description: 'Фантастический фильм о путешествии через червоточину',
                releaseYear: 2014,
                duration: 169,
                genre: ['фантастика', 'драма', 'приключения'],
                producerId: new mongoose.Types.ObjectId(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(movieService, 'getById').mockResolvedValueOnce(movie as any);

            const response = await request(app).get(`/api/movies/${id.toString()}`);
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Интерстеллар');
            expect(response.body.releaseYear).toBe(2014);
        });

        test('Should throw 404 when movie not found', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            jest
                .spyOn(movieService, 'getById')
                .mockRejectedValueOnce(new NotFoundException(`Movie with id ${id} not found`));

            const response = await request(app).get(`/api/movies/${id}`);
            expect(response.status).toBe(404);
        });

        test('Should validate movie ID format', async () => {
            const response = await request(app).get('/api/movies/invalid-id');
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Movie id invalid-id is invalid');
        });
    });

    describe('POST /api/movies', () => {
        test('Should create a movie', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const body = {
                title: 'Интерстеллар',
                description: 'Фантастический фильм о путешествии через червоточину',
                releaseYear: 2014,
                duration: 169,
                genre: ['фантастика', 'драма', 'приключения'],
                producerId: new mongoose.Types.ObjectId().toString(),
            };

            jest.spyOn(movieService, 'create').mockResolvedValueOnce(id);
            jest.spyOn(producerService, 'exists').mockResolvedValueOnce(true);

            const response = await request(app).post('/api/movies').send(body);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id });
        });

        test('Should throw 400 when producer does not exist', async () => {
            const body = {
                title: 'Интерстеллар',
                description: 'Фантастический фильм о путешествии через червоточину',
                releaseYear: 2014,
                duration: 169,
                genre: ['фантастика', 'драма', 'приключения'],
                producerId: new mongoose.Types.ObjectId().toString(),
            };

            jest.spyOn(producerService, 'exists').mockResolvedValueOnce(false);

            const response = await request(app)
                .post('/api/movies')
                .send(body);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                errors: [`Producer with id ${body.producerId} doesn't exists.`],
            });
        });

        test('Should validate required fields', async () => {
            const response = await request(app).post('/api/movies').send({});
            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    'title must be longer than or equal to 1 characters',
                    'title must be shorter than or equal to 400 characters',
                    'title should not be empty',
                    'title must be a string',
                    'releaseYear must not be greater than 2031',
                    'releaseYear must not be less than 1888',
                    'releaseYear must be an integer number',
                    'duration must not be greater than 240',
                    'duration must not be less than 1',
                    'duration must not be greater than 240',
                    "duration must not be greater than 240",
                    "duration must be an integer number",
                    "producerId should not be empty",
                    "producerId must be a string"
                ])
            );
        });

        test('Should validate release year range', async () => {
            const body = {
                title: 'Интерстеллар',
                releaseYear: 1000,
                duration: 169,
                producerId: new mongoose.Types.ObjectId().toString(),
            };

            const response = await request(app).post('/api/movies').send(body);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain(
                'releaseYear must not be less than 1888'
            );
        });
    });



    describe('GET /api/movies', () => {
        test('Should return list of movies', async () => {
            const movies = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'Интерстеллар',
                    releaseYear: 2014,
                    duration: 169,
                    producerId: new mongoose.Types.ObjectId(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'Титаник',
                    releaseYear: 1997,
                    duration: 195,
                    producerId: new mongoose.Types.ObjectId(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            jest.spyOn(movieService, 'getAll').mockResolvedValueOnce(movies as any);

            const response = await request(app).get('/api/movies');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].title).toBe('Интерстеллар');
            expect(response.body[1].title).toBe('Титаник');
        });

        test('Should return empty list', async () => {
            jest.spyOn(movieService, 'getAll').mockResolvedValueOnce([]);
            const response = await request(app).get('/api/movies');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        test('Should accept pagination parameters', async () => {
            const movies = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    title: 'Интерстеллар',
                    releaseYear: 2014,
                    duration: 169,
                    producerId: new mongoose.Types.ObjectId(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            jest.spyOn(movieService, 'getAll').mockResolvedValueOnce(movies as any);

            const response = await request(app)
                .get('/api/movies')
                .query({ skip: 10, limit: 5 });
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
        });
    });

    describe('PATCH /api/movies/:id', () => {
        test('Should update a movie', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const body = {
                title: 'Интерстеллар (Обновленный)',
                releaseYear: 2015,
            };

            jest.spyOn(movieService, 'update').mockResolvedValueOnce();
            jest.spyOn(producerService, 'exists').mockResolvedValueOnce(true);

            const response = await request(app)
                .patch(`/api/movies/${id}`)
                .send(body);
            expect(response.status).toBe(200);
        });

        test('Should validate producer when updating producerId', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const body = {
                producerId: new mongoose.Types.ObjectId().toString(),
            };

            jest.spyOn(producerService, 'exists').mockResolvedValueOnce(false);

            const response = await request(app)
                .patch(`/api/movies/${id}`)
                .send(body);
            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /api/movies/:id', () => {
        test('Should delete a movie', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            jest.spyOn(movieService, 'remove').mockResolvedValueOnce();

            const response = await request(app).delete(`/api/movies/${id}`);
            expect(response.status).toBe(204);
        });

        test('Should validate movie ID', async () => {
            const response = await request(app).delete('/api/movies/invalid-id');
            expect(response.status).toBe(400);
        });
    });
});