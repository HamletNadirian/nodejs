import * as producerService from './producer.service';
import * as producerRepository from './producer.repository';
import mongoose from 'mongoose';
import { ValidationException } from '../exceptions/ValidationException';
import { NotFoundException } from '../exceptions/NotFoundException';

describe('Producer Service', () => {
    describe('create', () => {
        test('should create a producer', async () => {
            const producerId = new mongoose.Types.ObjectId().toString();
            const createDto = {
                name: 'Warner Bros. Pictures',
                country: 'США',
                foundedYear: 1923,
            };

            jest.spyOn(producerRepository, 'create').mockResolvedValueOnce(producerId);

            const result = await producerService.create(createDto);
            expect(result).toBe(producerId);
        });
    });

    describe('getById', () => {
        test('should return a producer', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const producer = {
                _id: new mongoose.Types.ObjectId(id),
                name: 'Warner Bros. Pictures',
                country: 'США',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(producerRepository, 'getById').mockResolvedValueOnce(producer);

            const result = await producerService.getById(id);
            expect(result.name).toBe('Warner Bros. Pictures');
        });

        test('should throw NotFoundException when producer not found', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            jest.spyOn(producerRepository, 'getById').mockResolvedValueOnce(null);

            await expect(producerService.getById(id)).rejects.toThrow(NotFoundException);
        });

        test('should validate producer ID format', async () => {
            await expect(producerService.getById('invalid-id')).rejects.toThrow(
                ValidationException
            );
        });
    });

    describe('getAll', () => {
        test('should return list of producers', async () => {
            const producers = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    name: 'Warner Bros. Pictures',
                    country: 'США',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    name: 'Paramount Pictures',
                    country: 'США',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            jest.spyOn(producerRepository, 'getAll').mockResolvedValueOnce(producers);

            const result = await producerService.getAll(0, 10);
            expect(result).toHaveLength(2);
        });
    });

    describe('update', () => {
        test('should update a producer', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const updateDto = {
                name: 'Updated Name',
                country: 'Updated Country',
            };

            jest.spyOn(producerRepository, 'update').mockResolvedValueOnce();
            jest.spyOn(producerRepository, 'exists').mockResolvedValueOnce(true);

            await producerService.update(id, updateDto);
            expect(producerRepository.update).toHaveBeenCalledWith(id, updateDto);
        });

        test('should throw NotFoundException when producer not found', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const updateDto = { name: 'Updated' };

            jest.spyOn(producerRepository, 'exists').mockResolvedValueOnce(false);

            await expect(producerService.update(id, updateDto)).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('remove', () => {
        test('should remove a producer', async () => {
            const id = new mongoose.Types.ObjectId().toString();

            jest.spyOn(producerRepository, 'exists').mockResolvedValueOnce(true);
            jest.spyOn(producerRepository, 'hasMovies').mockResolvedValueOnce(false);
            jest.spyOn(producerRepository, 'remove').mockResolvedValueOnce();

            await producerService.remove(id);
            expect(producerRepository.remove).toHaveBeenCalledWith(id);
        });

        test('should throw when producer has movies', async () => {
            const id = new mongoose.Types.ObjectId().toString();

            jest.spyOn(producerRepository, 'exists').mockResolvedValueOnce(true);
            jest.spyOn(producerRepository, 'hasMovies').mockResolvedValueOnce(true);

            await expect(producerService.remove(id)).rejects.toThrow(ValidationException);
        });
    });

    describe('exists', () => {
        test('should return true when producer exists', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            jest.spyOn(producerRepository, 'exists').mockResolvedValueOnce(true);

            const result = await producerService.exists(id);
            expect(result).toBe(true);
        });

        test('should return false when producer does not exist', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            jest.spyOn(producerRepository, 'exists').mockResolvedValueOnce(false);

            const result = await producerService.exists(id);
            expect(result).toBe(false);
        });

        test('should validate producer ID', async () => {
            await expect(producerService.exists('invalid-id')).rejects.toThrow(
                ValidationException
            );
        });
    });
});