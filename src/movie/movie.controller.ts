import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import * as movieService from './movie.service';
import { MovieCreateDto } from './dto/MovieCreateDto';
import { MovieUpdateDto } from './dto/MovieUpdateDto';

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Управление фильмами
 */

/**
 * @swagger
 * /api/movies:
 *   post:
 *     tags: [Movies]
 *     summary: Создание нового фильма
 *     description: Создает новый фильм с указанными данными
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieCreate'
 *     responses:
 *       201:
 *         description: Фильм успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID созданного фильма
 *       400:
 *         description: Ошибка валидации
 */
export const createMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const movieCreateDto = plainToInstance(MovieCreateDto, req.body);
        const id = await movieService.create(movieCreateDto);
        res.status(StatusCodes.CREATED).json({ id });
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Получение фильма по ID
 *     description: Возвращает информацию о фильме по его ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID фильма
 *     responses:
 *       200:
 *         description: Информация о фильме
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Фильм не найден
 */
export const getMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const movie = await movieService.getById(id);
        res.status(StatusCodes.OK).json(movie);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags: [Movies]
 *     summary: Получение списка фильмов
 *     description: Возвращает список фильмов с пагинацией
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Количество пропускаемых элементов
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Максимальное количество возвращаемых элементов
 *     responses:
 *       200:
 *         description: Список фильмов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
export const getAllMovies = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const skip = parseInt(req.query.skip as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;

        const movies = await movieService.getAll(skip, limit);
        res.status(StatusCodes.OK).json(movies);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/movies/{id}:
 *   patch:
 *     tags: [Movies]
 *     summary: Обновление фильма
 *     description: Обновляет информацию о фильме
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID фильма
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieUpdate'
 *     responses:
 *       200:
 *         description: Фильм успешно обновлен
 *       404:
 *         description: Фильм не найден
 */
export const updateMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const movieUpdateDto = plainToInstance(MovieUpdateDto, req.body);
        await movieService.update(id, movieUpdateDto);
        res.status(StatusCodes.OK).send();
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     tags: [Movies]
 *     summary: Удаление фильма
 *     description: Удаляет фильм по его ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID фильма
 *     responses:
 *       204:
 *         description: Фильм успешно удален
 *       404:
 *         description: Фильм не найден
 */
export const deleteMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        await movieService.remove(id);
        res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        next(error);
    }
};