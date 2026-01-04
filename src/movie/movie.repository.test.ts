import * as movieRepository from './movie.repository';
import {
    clearDatabase,
    startMongoContainer,
    stopMongoContainer,
} from '../test/mongo.setup';
import mongoose from 'mongoose';
import Movie from './movie.model';
import Producer from '../producer/producer.model';

describe('Movie Repository', () => {
    beforeAll(async () => {
        await startMongoContainer();
    });

    afterAll(async () => {
        await stopMongoContainer();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    describe('create', () => {
        test('should create a movie', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            const movieId = await movieRepository.create({
                title: 'Test Movie',
                releaseYear: 2024,
                duration: 120,
                producerId: producer._id.toString(),
            });

            expect(movieId).toBeDefined();

            const movie = await Movie.findById(movieId);
            expect(movie).toBeDefined();
            expect(movie!.title).toBe('Test Movie');
            expect(movie!.releaseYear).toBe(2024);
            expect(movie!.producerId.toString()).toBe(producer._id.toString());
        });

        test('should validate required fields', async () => {
            await expect(
                movieRepository.create({
                    title: '',
                    releaseYear: 2024,
                    duration: 120,
                    producerId: new mongoose.Types.ObjectId().toString(),
                })
            ).rejects.toMatchObject({
                name: 'ValidationError',
                message: expect.stringContaining('Movie validation failed'),
            });
        });

        test('should validate release year', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            await expect(
                movieRepository.create({
                    title: 'Test Movie',
                    releaseYear: 1000,
                    duration: 120,
                    producerId: producer._id.toString(),
                })
            ).rejects.toMatchObject({
                name: 'ValidationError',
            });
        });
    });

    describe('getById', () => {
        test('should get a movie by id', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            const movie = await new Movie({
                title: 'Test Movie',
                releaseYear: 2024,
                duration: 120,
                producerId: producer._id,
            }).save();

            const result = await movieRepository.getById(movie._id.toString());
            expect(result).toBeDefined();
            expect(result!._id.toString()).toBe(movie._id.toString());
            expect(result!.title).toBe('Test Movie');
        });

        test('should return null when movie not found', async () => {
            const result = await movieRepository.getById(
                new mongoose.Types.ObjectId().toString()
            );
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        test('should get all movies', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            await new Movie({
                title: 'Movie 1',
                releaseYear: 2024,
                duration: 120,
                producerId: producer._id,
            }).save();

            await new Movie({
                title: 'Movie 2',
                releaseYear: 2023,
                duration: 110,
                producerId: producer._id,
            }).save();

            const movies = await movieRepository.getAll();
            expect(movies).toHaveLength(2);
            // Через сортування (.sort({createdAt: -1})) Movie 2 буде першим..
            expect(movies[1].title).toBe('Movie 1');
            expect(movies[0].title).toBe('Movie 2');
        });

        test('should support pagination', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            for (let i = 1; i <= 15; i++) {
                await new Movie({
                    title: `Movie ${i}`,
                    releaseYear: 2024,
                    duration: 120,
                    producerId: producer._id,
                }).save();
            }

            const movies = await movieRepository.getAll(10, 5);
            expect(movies).toHaveLength(5);
        });
    });

    describe('update', () => {
        test('should update a movie', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            const movie = await new Movie({
                title: 'Original Title',
                releaseYear: 2024,
                duration: 120,
                producerId: producer._id,
            }).save();

            await movieRepository.update(movie._id.toString(), {
                title: 'Updated Title',
                releaseYear: 2025,
            });

            const updatedMovie = await Movie.findById(movie._id);
            expect(updatedMovie!.title).toBe('Updated Title');
            expect(updatedMovie!.releaseYear).toBe(2025);
            expect(updatedMovie!.duration).toBe(120);
        });

        test('should update producerId', async () => {
            const producer1 = await new Producer({
                name: 'Producer 1',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            const producer2 = await new Producer({
                name: 'Producer 2',
                country: 'UK',
                foundedYear: 1990,
            }).save();

            const movie = await new Movie({
                title: 'Test Movie',
                releaseYear: 2024,
                duration: 120,
                producerId: producer1._id,
            }).save();

            await movieRepository.update(movie._id.toString(), {
                producerId: producer2._id.toString(),
            });

            const updatedMovie = await Movie.findById(movie._id);
            expect(updatedMovie!.producerId.toString()).toBe(producer2._id.toString());
        });
    });

    describe('remove', () => {
        test('should remove a movie', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            const movie = await new Movie({
                title: 'Test Movie',
                releaseYear: 2024,
                duration: 120,
                producerId: producer._id,
            }).save();

            await movieRepository.remove(movie._id.toString());

            const deletedMovie = await Movie.findById(movie._id);
            expect(deletedMovie).toBeNull();
        });
    });

    describe('exists', () => {
        test('should return true when movie exists', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            const movie = await new Movie({
                title: 'Test Movie',
                releaseYear: 2024,
                duration: 120,
                producerId: producer._id,
            }).save();

            const exists = await movieRepository.exists(movie._id.toString());
            expect(exists).toBe(true);
        });

        test('should return false when movie does not exist', async () => {
            const exists = await movieRepository.exists(
                new mongoose.Types.ObjectId().toString()
            );
            expect(exists).toBe(false);
        });
    });
});