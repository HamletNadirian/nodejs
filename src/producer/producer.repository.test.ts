import * as producerRepository from './producer.repository';
import {
    clearDatabase,
    startMongoContainer,
    stopMongoContainer,
} from '../test/mongo.setup';
import mongoose from 'mongoose';
import Producer from './producer.model';
import Movie from '../movie/movie.model';

describe('Producer Repository', () => {
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
        test('should create a producer', async () => {
            const producerId = await producerRepository.create({
                name: 'Warner Bros. Pictures',
                country: 'США',
                foundedYear: 1923,
                website: 'https://www.warnerbros.com',
                bio: 'Американская киностудия, одна из крупнейших в мире',
            });

            expect(producerId).toBeDefined();

            const producer = await Producer.findById(producerId);
            expect(producer).toBeDefined();
            expect(producer!.name).toBe('Warner Bros. Pictures');
            expect(producer!.country).toBe('США');
            expect(producer!.foundedYear).toBe(1923);
            expect(producer!.website).toBe('https://www.warnerbros.com');
        });

        test('should create a producer with minimal data', async () => {
            const producerId = await producerRepository.create({
                name: 'Test Producer',
            });

            expect(producerId).toBeDefined();

            const producer = await Producer.findById(producerId);
            expect(producer).toBeDefined();
            expect(producer!.name).toBe('Test Producer');
            expect(producer!.country).toBeUndefined();
            expect(producer!.foundedYear).toBeUndefined();
        });

        test('should validate required fields - name is required', async () => {
            await expect(
                producerRepository.create({} as any)
            ).rejects.toMatchObject({
                name: 'ValidationError',
                message: expect.stringContaining('name: Path `name` is required'),
            });
        });

        test('should validate name length - name should not be empty', async () => {
            await expect(
                producerRepository.create({ name: '' } as any)
            ).rejects.toMatchObject({
                name: 'ValidationError',
                message: expect.stringContaining('name: Path `name` is required'),
            });
        });

        test('should validate foundedYear range', async () => {
            await expect(
                producerRepository.create({
                    name: 'Test Producer',
                    foundedYear: 1700,
                })
            ).rejects.toMatchObject({
                name: 'ValidationError',
                message: expect.stringContaining('foundedYear: Path `foundedYear` (1700) is less than minimum allowed value'),
            });
        });

        test('should validate website format', async () => {
            await expect(
                producerRepository.create({
                    name: 'Test Producer',
                    website: 'invalid-url',
                })
            ).rejects.toMatchObject({
                name: 'ValidationError',
                message: expect.stringContaining('website'),
            });
        });
    });

    describe('getById', () => {
        test('should get a producer by id', async () => {
            const producer = await new Producer({
                name: 'Warner Bros. Pictures',
                country: 'США',
                foundedYear: 1923,
            }).save();

            const result = await producerRepository.getById(producer._id.toString());
            expect(result).toBeDefined();
            expect(result!._id.toString()).toBe(producer._id.toString());
            expect(result!.name).toBe('Warner Bros. Pictures');
            expect(result!.country).toBe('США');
            expect(result!.foundedYear).toBe(1923);
        });

        test('should return null when producer not found', async () => {
            const result = await producerRepository.getById(
                new mongoose.Types.ObjectId().toString()
            );
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        test('should get all producers', async () => {
            await new Producer({
                name: 'Producer 1',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            await new Producer({
                name: 'Producer 2',
                country: 'UK',
                foundedYear: 1990,
            }).save();

            const producers = await producerRepository.getAll();
            expect(producers).toHaveLength(2);

            const producerNames = producers.map(p => p.name);
            expect(producerNames).toContain('Producer 1');
            expect(producerNames).toContain('Producer 2');
        });

        test('should return empty list when no producers', async () => {
            const producers = await producerRepository.getAll();
            expect(producers).toHaveLength(0);
            expect(producers).toEqual([]);
        });

        test('should support pagination', async () => {
            for (let i = 1; i <= 15; i++) {
                await new Producer({
                    name: `Producer ${i}`,
                    country: 'USA',
                    foundedYear: 1900 + i,
                }).save();

                await new Promise(resolve => setTimeout(resolve, 1));
            }

            const firstPage = await producerRepository.getAll(0, 5);
            expect(firstPage).toHaveLength(5);

            const secondPage = await producerRepository.getAll(5, 5);
            expect(secondPage).toHaveLength(5);

            const thirdPage = await producerRepository.getAll(10, 5);
            expect(thirdPage).toHaveLength(5);

            const firstPageIds = firstPage.map(p => p._id.toString());
            const secondPageIds = secondPage.map(p => p._id.toString());
            const thirdPageIds = thirdPage.map(p => p._id.toString());

            secondPageIds.forEach(id => {
                expect(firstPageIds).not.toContain(id);
            });

            thirdPageIds.forEach(id => {
                expect(firstPageIds).not.toContain(id);
                expect(secondPageIds).not.toContain(id);
            });
        });
    });

    describe('update', () => {
        test('should update a producer', async () => {
            const producer = await new Producer({
                name: 'Original Name',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            await producerRepository.update(producer._id.toString(), {
                name: 'Updated Name',
                country: 'UK',
                foundedYear: 1990,
            });

            const updatedProducer = await Producer.findById(producer._id);
            expect(updatedProducer!.name).toBe('Updated Name');
            expect(updatedProducer!.country).toBe('UK');
            expect(updatedProducer!.foundedYear).toBe(1990);
        });

        test('should update partial fields', async () => {
            const producer = await new Producer({
                name: 'Original Name',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            await producerRepository.update(producer._id.toString(), {
                name: 'Updated Name',
            });

            const updatedProducer = await Producer.findById(producer._id);
            expect(updatedProducer!.name).toBe('Updated Name');
            expect(updatedProducer!.country).toBe('USA');
            expect(updatedProducer!.foundedYear).toBe(2000);
        });

        test('should update website and bio', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
            }).save();

            await producerRepository.update(producer._id.toString(), {
                website: 'https://example.com',
                bio: 'Some biography text',
            });

            const updatedProducer = await Producer.findById(producer._id);
            expect(updatedProducer!.website).toBe('https://example.com');
            expect(updatedProducer!.bio).toBe('Some biography text');
        });
    });

    describe('remove', () => {
        test('should remove a producer', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            await producerRepository.remove(producer._id.toString());

            const deletedProducer = await Producer.findById(producer._id);
            expect(deletedProducer).toBeNull();
        });
    });

    describe('exists', () => {
        test('should return true when producer exists', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            const exists = await producerRepository.exists(producer._id.toString());
            expect(exists).toBe(true);
        });

        test('should return false when producer does not exist', async () => {
            const exists = await producerRepository.exists(
                new mongoose.Types.ObjectId().toString()
            );
            expect(exists).toBe(false);
        });
    });

    describe('hasMovies', () => {
        test('should return true when producer has movies', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            await new Movie({
                title: 'Test Movie',
                releaseYear: 2024,
                duration: 120,
                producerId: producer._id,
            }).save();

            const hasMovies = await producerRepository.hasMovies(producer._id.toString());
            expect(hasMovies).toBe(true);
        });

        test('should return false when producer has no movies', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            const hasMovies = await producerRepository.hasMovies(producer._id.toString());
            expect(hasMovies).toBe(false);
        });

        test('should return false for non-existent producer', async () => {
            const hasMovies = await producerRepository.hasMovies(
                new mongoose.Types.ObjectId().toString()
            );
            expect(hasMovies).toBe(false);
        });

        test('should handle multiple movies for same producer', async () => {
            const producer = await new Producer({
                name: 'Test Producer',
                country: 'USA',
                foundedYear: 2000,
            }).save();

            await Promise.all([
                new Movie({
                    title: 'Movie 1',
                    releaseYear: 2024,
                    duration: 120,
                    producerId: producer._id,
                }).save(),
                new Movie({
                    title: 'Movie 2',
                    releaseYear: 2023,
                    duration: 110,
                    producerId: producer._id,
                }).save(),
                new Movie({
                    title: 'Movie 3',
                    releaseYear: 2022,
                    duration: 130,
                    producerId: producer._id,
                }).save(),
            ]);

            const hasMovies = await producerRepository.hasMovies(producer._id.toString());
            expect(hasMovies).toBe(true);
        });
    });
});