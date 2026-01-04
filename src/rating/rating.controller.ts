import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import * as ratingService from './rating.service';
import { RatingCreateDto } from './dto/RatingCreateDto';
import { RatingQueryDto } from './dto/RatingQueryDto';
import { RatingCountsDto } from './dto/RatingCountsDto';

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Управление рейтингами фильмов
 */

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     tags: [Ratings]
 *     summary: Создание нового рейтинга
 *     description: Создает новый рейтинг для фильма
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RatingCreate'
 *     responses:
 *       201:
 *         description: Рейтинг успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID созданного рейтинга
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
export const createRating = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const ratingCreateDto = plainToInstance(RatingCreateDto, req.body);
        const id = await ratingService.create(ratingCreateDto);
        res.status(StatusCodes.CREATED).json({ id });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/ratings:
 *   get:
 *     tags: [Ratings]
 *     summary: Получение рейтингов по фильму
 *     description: Возвращает список рейтингов для указанного фильма
 *     parameters:
 *       - in: query
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID фильма
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Номер элемента, с которого начинается выборка
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Максимальное количество возвращаемых элементов
 *     responses:
 *       200:
 *         description: Список рейтингов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rating'
 */
export const getRatingsByMovieId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const query = plainToInstance(RatingQueryDto, {
            movieId: req.query.movieId as string,
            skip: parseInt(req.query.from as string) || 0,
            limit: parseInt(req.query.size as string) || 10,
        });

        const ratings = await ratingService.findByMovieId(query);
        res.status(StatusCodes.OK).json(ratings);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/ratings/_counts:
 *   post:
 *     tags: [Ratings]
 *     summary: Получение количества рейтингов для нескольких фильмов
 *     description: Возвращает количество рейтингов для каждого из указанных фильмов
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movieIds]
 *             properties:
 *               movieIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Массив ID фильмов
 *                 example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
 *     responses:
 *       200:
 *         description: Количество рейтингов для каждого фильма
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: integer
 *               example:
 *                 "507f1f77bcf86cd799439011": 5
 *                 "507f1f77bcf86cd799439012": 2
 */
export const getRatingCounts = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const ratingCountsDto = plainToInstance(RatingCountsDto, req.body);
        const counts = await ratingService.countByMovieIds(ratingCountsDto.movieIds);
        res.status(StatusCodes.OK).json(counts);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/ratings/{movieId}/average:
 *   get:
 *     tags: [Ratings]
 *     summary: Получение среднего рейтинга фильма
 *     description: Возвращает средний рейтинг и количество оценок для указанного фильма
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID фильма
 *     responses:
 *       200:
 *         description: Средний рейтинг и количество оценок
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average:
 *                   type: number
 *                   format: float
 *                   example: 8.5
 *                 count:
 *                   type: integer
 *                   example: 42
 */
export const getAverageRating = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const movieId = req.params.movieId as string;
        const averageRating = await ratingService.getAverageRating(movieId);
        res.status(StatusCodes.OK).json(averageRating);
    } catch (error) {
        next(error);
    }
};