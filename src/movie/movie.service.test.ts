import * as movieService from './movie.service';
import * as movieRepository from './movie.repository';
import * as producerService from '../producer/producer.service';
import mongoose from 'mongoose';
import { ValidationException } from '../exceptions/ValidationException';
import { NotFoundException } from '../exceptions/NotFoundException';

describe('Movie Service', () => {

    describe('getById', () => {
        test('should return a movie', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const movie = {
                _id: new mongoose.Types.ObjectId(id),
                title: 'Интерстеллар',
                releaseYear: 2014,
                duration: 169,
                producerId: new mongoose.Types.ObjectId(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // @ts-ignore
            jest.spyOn(movieRepository, 'getById').mockResolvedValueOnce(movie);

            const result = await movieService.getById(id);
            expect(result.title).toBe('Интерстеллар');
            expect(result.releaseYear).toBe(2014);
        });

        test('should throw NotFoundException when movie not found', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            jest.spyOn(movieRepository, 'getById').mockResolvedValueOnce(null);

            await expect(movieService.getById(id)).rejects.toThrow(NotFoundException);
        });

        test('should validate movie ID format', async () => {
            await expect(movieService.getById('invalid-id')).rejects.toMatchObject({
                errors: expect.arrayContaining(['Movie id invalid-id is invalid']),
            });
        });
    });

    describe('create', () => {
        test('should create a movie', async () => {
            const movieId = new mongoose.Types.ObjectId().toString();
            const producerId = new mongoose.Types.ObjectId().toString();
            const createDto = {
                title: 'Интерстеллар',
                releaseYear: 2014,
                duration: 169,
                producerId,
            };

            jest.spyOn(producerService, 'exists').mockResolvedValueOnce(true);
            jest.spyOn(movieRepository, 'create').mockResolvedValueOnce(movieId);

            const result = await movieService.create(createDto);
            expect(result).toBe(movieId);
            expect(producerService.exists).toHaveBeenCalledWith(producerId);
            expect(movieRepository.create).toHaveBeenCalledWith(createDto);
        });

        test('should throw when producer does not exist', async () => {
            const producerId = new mongoose.Types.ObjectId().toString();
            const createDto = {
                title: 'Интерстеллар',
                releaseYear: 2014,
                duration: 169,
                producerId,
            };

            jest.spyOn(producerService, 'exists').mockResolvedValueOnce(false);

            await expect(movieService.create(createDto)).rejects.toThrow(
                ValidationException
            );
        });

        test('should validate producerId format', async () => {
            const createDto = {
                title: 'Интерстеллар',
                releaseYear: 2014,
                duration: 169,
                producerId: 'invalid-id',
            };

            await expect(movieService.create(createDto)).rejects.toMatchObject({
                errors: expect.arrayContaining(['Producer id invalid-id is invalid']),
            });
        });
    });
    describe('update', () => {
        test('should update a movie', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const updateDto = {
                title: 'Updated Title',
                releaseYear: 2020,
            };

            jest.spyOn(movieRepository, 'update').mockResolvedValueOnce();

            await movieService.update(id, updateDto);
            expect(movieRepository.update).toHaveBeenCalledWith(id, updateDto);
        });

        test('should validate producer when updating producerId', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const producerId = new mongoose.Types.ObjectId().toString();
            const updateDto = {
                producerId,
            };

            jest.spyOn(producerService, 'exists').mockResolvedValueOnce(true);
            jest.spyOn(movieRepository, 'update').mockResolvedValueOnce();
            await movieService.update(id, updateDto);
            expect(producerService.exists).toHaveBeenCalledWith(producerId);
        });

        test('should throw when producer does not exist', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const producerId = new mongoose.Types.ObjectId().toString();
            const updateDto = {
                producerId,
            };

            jest.spyOn(producerService, 'exists').mockResolvedValueOnce(false);

            await expect(movieService.update(id, updateDto)).rejects.toThrow(
                ValidationException
            );
        });
    });
    describe('getAll', () => {
        test('should return list of movies', async () => {
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

            // @ts-ignore
            jest.spyOn(movieRepository, 'getAll').mockResolvedValueOnce(movies);

            const result = await movieService.getAll(0, 10);
            expect(result).toHaveLength(2);
            expect(result[0].title).toBe('Интерстеллар');
            expect(result[1].title).toBe('Титаник');
        });

        test('should return empty list', async () => {
            jest.spyOn(movieRepository, 'getAll').mockResolvedValueOnce([]);
            const result = await movieService.getAll();
            expect(result).toHaveLength(0);
        });
    });



    describe('remove', () => {
        test('should remove a movie', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            jest.spyOn(movieRepository, 'remove').mockResolvedValueOnce();

            await movieService.remove(id);
            expect(movieRepository.remove).toHaveBeenCalledWith(id);
        });

        test('should validate movie ID', async () => {
            await expect(movieService.remove('invalid-id')).rejects.toMatchObject({
                errors: expect.arrayContaining(['Movie id invalid-id is invalid']),
            });
        });
    });

    describe('exists', () => {
        test('should return true when movie exists', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            jest.spyOn(movieRepository, 'exists').mockResolvedValueOnce(true);

            const result = await movieService.exists(id);
            expect(result).toBe(true);
        });

        test('should return false when movie does not exist', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            jest.spyOn(movieRepository, 'exists').mockResolvedValueOnce(false);

            const result = await movieService.exists(id);
            expect(result).toBe(false);
        });

        test('should validate movie ID', async () => {
            await expect(movieService.exists('invalid-id')).rejects.toMatchObject({
                errors: expect.arrayContaining(['Movie id invalid-id is invalid']),
            });
        });
    });
});