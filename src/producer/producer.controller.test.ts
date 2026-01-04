import 'reflect-metadata';
import request = require('supertest');
import mongoose from 'mongoose';
import * as producerService from './producer.service';
import app from '../app';
import { NotFoundException } from '../exceptions/NotFoundException';

describe('Producer Controller', () => {
    describe('POST /api/producers', () => {
        test('Should create a producer', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const body = {
                name: 'Warner Bros. Pictures',
                country: 'США',
                foundedYear: 1923,
                website: 'https://www.warnerbros.com',
                bio: 'Американская киностудия, одна из крупнейших в мире',
            };

            jest.spyOn(producerService, 'create').mockResolvedValueOnce(id);
            const response = await request(app).post('/api/producers').send(body);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id });
        });

        test('Should validate required name field', async () => {
            const response = await request(app).post('/api/producers').send({});
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('name must be a string');
        });

        test('Should validate website URL format', async () => {
            const body = {
                name: 'Test Producer',
                website: 'invalid-url',
            };

            const response = await request(app).post('/api/producers').send(body);
            expect(response.status).toBe(400);
            expect(response.body.errors).toContain('Website must be a valid URL');
        });
    });

    describe('GET /api/producers/:id', () => {
        test('Should return a producer', async () => {
            const id = new mongoose.Types.ObjectId();
            const producer = {
                _id: id,
                name: 'Warner Bros. Pictures',
                country: 'США',
                foundedYear: 1923,
                website: 'https://www.warnerbros.com',
                bio: 'Американская киностудия',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(producerService, 'getById').mockResolvedValueOnce(producer as any);

            const response = await request(app).get(`/api/producers/${id.toString()}`);
            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Warner Bros. Pictures');
            expect(response.body.country).toBe('США');
        });

        test('Should throw 404 when producer not found', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            jest
                .spyOn(producerService, 'getById')
                .mockRejectedValueOnce(new NotFoundException(`Producer with id ${id} not found`));

            const response = await request(app).get(`/api/producers/${id}`);
            expect(response.status).toBe(404);
        });

        test('Should validate producer ID format', async () => {
            const response = await request(app).get('/api/producers/invalid-id');
            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/producers', () => {
        test('Should return list of producers', async () => {
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

            jest.spyOn(producerService, 'getAll').mockResolvedValueOnce(producers as any);

            const response = await request(app).get('/api/producers');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].name).toBe('Warner Bros. Pictures');
            expect(response.body[1].name).toBe('Paramount Pictures');
        });

        test('Should return empty list', async () => {
            jest.spyOn(producerService, 'getAll').mockResolvedValueOnce([]);
            const response = await request(app).get('/api/producers');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        test('Should accept pagination parameters', async () => {
            const producers = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    name: 'Warner Bros. Pictures',
                    country: 'США',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            jest.spyOn(producerService, 'getAll').mockResolvedValueOnce(producers as any);

            const response = await request(app)
                .get('/api/producers')
                .query({ skip: 5, limit: 10 });
            expect(response.status).toBe(200);
        });
    });

    describe('PATCH /api/producers/:id', () => {
        test('Should update a producer', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const body = {
                name: 'Warner Bros. (Updated)',
                country: 'United States',
            };

            jest.spyOn(producerService, 'update').mockResolvedValueOnce();

            const response = await request(app)
                .patch(`/api/producers/${id}`)
                .send(body);
            expect(response.status).toBe(200);
        });

        test('Should validate producer ID', async () => {
            const response = await request(app)
                .patch('/api/producers/invalid-id')
                .send({ name: 'Updated' });
            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /api/producers/:id', () => {
        test('Should delete a producer', async () => {
            const id = new mongoose.Types.ObjectId().toString();
            jest.spyOn(producerService, 'remove').mockResolvedValueOnce();

            const response = await request(app).delete(`/api/producers/${id}`);
            expect(response.status).toBe(204);
        });

        test('Should validate producer ID', async () => {
            const response = await request(app).delete('/api/producers/invalid-id');
            expect(response.status).toBe(400);
        });
    });
});