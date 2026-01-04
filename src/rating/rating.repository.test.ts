import * as ratingRepository from './rating.repository';
import {
    clearDatabase,
    startMongoContainer,
    stopMongoContainer,
} from '../test/mongo.setup';
import mongoose from 'mongoose';
import Rating from './rating.model';
import Movie from '../movie/movie.model';
import Producer from '../producer/producer.model';
import { plainToInstance } from 'class-transformer';
import { RatingQueryDto } from './dto/RatingQueryDto';

describe('Rating Repository', () => {
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
        test('should create a rating', async () => {
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

            const ratingId = await ratingRepository.create({
                movieId: movie._id.toString(),
                score: 8,
                comment: 'Хороший фильм',
                createdBy: 'Иван Иванов',
                ratingDate: new Date('2024-01-15'),
            });

            expect(ratingId).toBeDefined();

            const rating = await Rating.findById(ratingId);
            expect(rating).toBeDefined();
            expect(rating!.score).toBe(8);
            expect(rating!.comment).toBe('Хороший фильм');
            expect(rating!.createdBy).toBe('Иван Иванов');
            expect(rating!.movieId.toString()).toBe(movie._id.toString());
        });

        test('should validate score range', async () => {
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

            await expect(
                ratingRepository.create({
                    movieId: movie._id.toString(),
                    score: 15,
                })
            ).rejects.toMatchObject({
                name: 'ValidationError',
            });
        });

        test('should validate comment length', async () => {
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

            await expect(
                ratingRepository.create({
                    movieId: movie._id.toString(),
                    score: 8,
                    comment: 'a'.repeat(501),
                })
            ).rejects.toMatchObject({
                name: 'ValidationError',
            });
        });
    });

    describe('findByMovieId', () => {
        test('should find ratings by movieId with sorting', async () => {
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

            const rating1 = await new Rating({
                movieId: movie._id,
                score: 8,
                comment: 'Старый рейтинг',
                ratingDate: new Date('2024-01-01'),
                createdBy: 'User1',
            }).save();

            await new Promise(resolve => setTimeout(resolve, 10));

            const rating2 = await new Rating({
                movieId: movie._id,
                score: 9,
                comment: 'Новый рейтинг',
                ratingDate: new Date('2024-01-15'),
                createdBy: 'User2',
            }).save();

            const query = plainToInstance(RatingQueryDto, {
                movieId: movie._id.toString(),
                skip: 0,
                limit: 10,
            });

            const ratings = await ratingRepository.findByMovieId(query);
            expect(ratings).toHaveLength(2);

            expect(ratings[0]._id.toString()).toBe(rating2._id.toString());
            expect(ratings[1]._id.toString()).toBe(rating1._id.toString());
        });

        test('should support pagination', async () => {
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

            for (let i = 1; i <= 15; i++) {
                await new Rating({
                    movieId: movie._id,
                    score: i % 10 + 1,
                    comment: `Comment ${i}`,
                    ratingDate: new Date(2024, 0, i),
                    createdBy: `User ${i}`,
                }).save();
            }

            const query1 = plainToInstance(RatingQueryDto, {
                movieId: movie._id.toString(),
                skip: 0,
                limit: 5,
            });

            const query2 = plainToInstance(RatingQueryDto, {
                movieId: movie._id.toString(),
                skip: 5,
                limit: 5,
            });

            const ratings1 = await ratingRepository.findByMovieId(query1);
            const ratings2 = await ratingRepository.findByMovieId(query2);

            expect(ratings1).toHaveLength(5);
            expect(ratings2).toHaveLength(5);

            const ids1 = ratings1.map(r => r._id.toString());
            const ids2 = ratings2.map(r => r._id.toString());

            ids2.forEach(id => {
                expect(ids1).not.toContain(id);
            });
        });

        test('should return empty array when no ratings', async () => {
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

            const query = plainToInstance(RatingQueryDto, {
                movieId: movie._id.toString(),
                skip: 0,
                limit: 10,
            });

            const ratings = await ratingRepository.findByMovieId(query);
            expect(ratings).toHaveLength(0);
            expect(ratings).toEqual([]);
        });
    });

    describe('countByMovieIds', () => {
        test('should count ratings for multiple movies', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            const movie1 = await new Movie({
                title: 'Movie 1',
                releaseYear: 2024,
                duration: 120,
                producerId: producer._id,
            }).save();

            const movie2 = await new Movie({
                title: 'Movie 2',
                releaseYear: 2023,
                duration: 110,
                producerId: producer._id,
            }).save();

            const movie3 = await new Movie({
                title: 'Movie 3',
                releaseYear: 2022,
                duration: 130,
                producerId: producer._id,
            }).save();


            await Promise.all([

                new Rating({ movieId: movie1._id, score: 8 }).save(),
                new Rating({ movieId: movie1._id, score: 9 }).save(),
                new Rating({ movieId: movie1._id, score: 7 }).save(),


                new Rating({ movieId: movie2._id, score: 6 }).save(),
                new Rating({ movieId: movie2._id, score: 8 }).save(),


            ]);

            const counts = await ratingRepository.countByMovieIds([
                movie1._id.toString(),
                movie2._id.toString(),
                movie3._id.toString(),
            ]);

            expect(counts[movie1._id.toString()]).toBe(3);
            expect(counts[movie2._id.toString()]).toBe(2);
            expect(counts[movie3._id.toString()]).toBe(0);
        });

        test('should handle empty movieIds array', async () => {
            const counts = await ratingRepository.countByMovieIds([]);
            expect(counts).toEqual({});
        });

        test('should handle movies with no ratings', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            const counts = await ratingRepository.countByMovieIds([movieId]);
            expect(counts[movieId]).toBe(0);
        });
    });

    describe('getAverageRating', () => {
        test('should calculate average rating for movie', async () => {
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


            await Promise.all([
                new Rating({ movieId: movie._id, score: 8 }).save(),
                new Rating({ movieId: movie._id, score: 9 }).save(),
                new Rating({ movieId: movie._id, score: 7 }).save(),
            ]);

            const result = await ratingRepository.getAverageRating(movie._id.toString());
            expect(result.average).toBe(8.0);
            expect(result.count).toBe(3);
        });

        test('should round average to 2 decimal places', async () => {
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

            await Promise.all([
                new Rating({ movieId: movie._id, score: 8 }).save(),
                new Rating({ movieId: movie._id, score: 9 }).save(),
                new Rating({ movieId: movie._id, score: 9 }).save(),
            ]);

            const result = await ratingRepository.getAverageRating(movie._id.toString());
            expect(result.average).toBe(8.67);
            expect(result.count).toBe(3);
        });

        test('should return zero for movie without ratings', async () => {
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

            const result = await ratingRepository.getAverageRating(movie._id.toString());
            expect(result.average).toBe(0);
            expect(result.count).toBe(0);
        });

        test('should return zero for non-existent movie', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            const result = await ratingRepository.getAverageRating(nonExistentId);
            expect(result.average).toBe(0);
            expect(result.count).toBe(0);
        });
    });

    describe('existsByMovieId', () => {
        test('should return true when movie has ratings', async () => {
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

            await new Rating({
                movieId: movie._id,
                score: 8,
            }).save();

            const exists = await ratingRepository.existsByMovieId(movie._id.toString());
            expect(exists).toBe(true);
        });

        test('should return false when movie has no ratings', async () => {
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

            const exists = await ratingRepository.existsByMovieId(movie._id.toString());
            expect(exists).toBe(false);
        });

        test('should return false for non-existent movie', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            const exists = await ratingRepository.existsByMovieId(nonExistentId);
            expect(exists).toBe(false);
        });
    });
});