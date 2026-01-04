import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import * as producerService from './producer.service';
import { ProducerCreateDto } from './dto/ProducerCreateDto';
import { ProducerUpdateDto } from './dto/ProducerUpdateDto';

/**
 * @swagger
 * tags:
 *   name: Producers
 *   description: Управление продюсерами
 */

/**
 * @swagger
 * /api/producers:
 *   post:
 *     tags: [Producers]
 *     summary: Создание нового продюсера
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProducerCreate'
 *     responses:
 *       201:
 *         description: Продюсер успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID созданного продюсера
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
export const createProducer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const producerCreateDto = plainToInstance(ProducerCreateDto, req.body);
        const id = await producerService.create(producerCreateDto);
        res.status(StatusCodes.CREATED).json({ id });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/producers/{id}:
 *   get:
 *     tags: [Producers]
 *     summary: Получение продюсера по ID
 *     parameters:
 *       - $ref: '#/components/parameters/ProducerId'
 *     responses:
 *       200:
 *         description: Информация о продюсере
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producer'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const getProducer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const producer = await producerService.getById(id);
        res.status(StatusCodes.OK).json(producer);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/producers:
 *   get:
 *     tags: [Producers]
 *     summary: Получение списка продюсеров
 *     parameters:
 *       - $ref: '#/components/parameters/SkipParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Список продюсеров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producer'
 */
export const getAllProducers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const skip = parseInt(req.query.skip as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;

        const producers = await producerService.getAll(skip, limit);
        res.status(StatusCodes.OK).json(producers);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/producers/{id}:
 *   patch:
 *     tags: [Producers]
 *     summary: Обновление продюсера
 *     parameters:
 *       - $ref: '#/components/parameters/ProducerId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProducerUpdate'
 *     responses:
 *       200:
 *         description: Продюсер успешно обновлен
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const updateProducer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const producerUpdateDto = plainToInstance(ProducerUpdateDto, req.body);
        await producerService.update(id, producerUpdateDto);
        res.status(StatusCodes.OK).send();
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/producers/{id}:
 *   delete:
 *     tags: [Producers]
 *     summary: Удаление продюсера
 *     parameters:
 *       - $ref: '#/components/parameters/ProducerId'
 *     responses:
 *       204:
 *         description: Продюсер успешно удален
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
export const deleteProducer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        await producerService.remove(id);
        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        next(error);
    }
};