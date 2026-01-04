import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const router = express.Router();

const projectRoot = process.cwd();
const controllerPath = path.join(projectRoot, 'src');

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API системи рейтингу фільмів',
            version: '1.0.0',
            description: 'API для управління фільмами, продюсерами та рейтингами',
            contact: {
                name: 'Hamlet',
                email: 'hamlet.nadirian@gmail.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:7777',
                description: 'Локальный сервер разработки',
            },
        ],
        tags: [
            {
                name: 'Movies',
                description: 'Операції з фільмами',
            },
            {
                name: 'Producers',
                description: 'Операції з продюсерами',
            },
            {
                name: 'Ratings',
                description: 'Операції з рейтингами фільмів',
            },
        ],
        components: {
            schemas: {
                MovieCreate: {
                    type: 'object',
                    required: ['title', 'releaseYear', 'duration', 'producerId'],
                    properties: {
                        title: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 200,
                            example: 'Интерстеллар',
                        },
                        description: {
                            type: 'string',
                            maxLength: 2000,
                            example: 'Фантастический фильм о путешествии через червоточину',
                        },
                        releaseYear: {
                            type: 'integer',
                            minimum: 1888,
                            maximum: 2030,
                            example: 2014,
                        },
                        duration: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 1440,
                            example: 169,
                        },
                        genre: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['фантастика', 'драма', 'приключения'],
                        },
                        producerId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                    },
                },
                MovieUpdate: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 200,
                            example: 'Интерстеллар (обновленный)',
                        },
                        description: {
                            type: 'string',
                            maxLength: 2000,
                            example: 'Обновленное описание фильма',
                        },
                        releaseYear: {
                            type: 'integer',
                            minimum: 1888,
                            maximum: 2030,
                            example: 2014,
                        },
                        duration: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 1440,
                            example: 170,
                        },
                        genre: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['фантастика', 'драма'],
                        },
                        producerId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                    },
                },
                Movie: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439012',
                        },
                        title: {
                            type: 'string',
                            example: 'Интерстеллар',
                        },
                        description: {
                            type: 'string',
                            example: 'Фантастический фильм о путешествии через червоточину',
                        },
                        releaseYear: {
                            type: 'integer',
                            example: 2014,
                        },
                        duration: {
                            type: 'integer',
                            example: 169,
                        },
                        genre: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['фантастика', 'драма', 'приключения'],
                        },
                        producerId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00.000Z',
                        },
                    },
                },

                ProducerCreate: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 200,
                            example: 'Warner Bros. Pictures',
                        },
                        country: {
                            type: 'string',
                            maxLength: 100,
                            example: 'США',
                        },
                        foundedYear: {
                            type: 'integer',
                            minimum: 1800,
                            example: 1923,
                        },
                        website: {
                            type: 'string',
                            format: 'url',
                            example: 'https://www.warnerbros.com',
                        },
                        bio: {
                            type: 'string',
                            maxLength: 2000,
                            example: 'Американская киностудия, одна из крупнейших в мире',
                        },
                    },
                },
                ProducerUpdate: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 200,
                            example: 'Warner Bros. Pictures (обновленное)',
                        },
                        country: {
                            type: 'string',
                            maxLength: 100,
                            example: 'United States',
                        },
                        foundedYear: {
                            type: 'integer',
                            minimum: 1800,
                            example: 1923,
                        },
                        website: {
                            type: 'string',
                            format: 'url',
                            example: 'https://www.warnerbros.com/movies',
                        },
                        bio: {
                            type: 'string',
                            maxLength: 2000,
                            example: 'Обновленная биография',
                        },
                    },
                },
                Producer: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        name: {
                            type: 'string',
                            example: 'Warner Bros. Pictures',
                        },
                        country: {
                            type: 'string',
                            example: 'США',
                        },
                        foundedYear: {
                            type: 'integer',
                            example: 1923,
                        },
                        website: {
                            type: 'string',
                            example: 'https://www.warnerbros.com',
                        },
                        bio: {
                            type: 'string',
                            example: 'Американская киностудия, одна из крупнейших в мире',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00.000Z',
                        },
                    },
                },

                RatingCreate: {
                    type: 'object',
                    required: ['movieId', 'score'],
                    properties: {
                        movieId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439012',
                        },
                        score: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 10,
                            example: 8,
                        },
                        comment: {
                            type: 'string',
                            maxLength: 500,
                            example: 'Отличный фильм!',
                        },
                        ratingDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00.000Z',
                        },
                        createdBy: {
                            type: 'string',
                            maxLength: 100,
                            example: 'Иван Иванов',
                        },
                    },
                },
                Rating: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439013',
                        },
                        movieId: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439012',
                        },
                        score: {
                            type: 'integer',
                            example: 8,
                        },
                        comment: {
                            type: 'string',
                            example: 'Отличный фильм!',
                        },
                        ratingDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00.000Z',
                        },
                        createdBy: {
                            type: 'string',
                            example: 'Иван Иванов',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-01-15T10:30:00.000Z',
                        },
                    },
                },

                Error: {
                    type: 'object',
                    properties: {
                        errors: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            example: ['Validation error', 'Field is required'],
                        },
                    },
                },
            },
            parameters: {
                MovieId: {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'ID фильма',
                },
                ProducerId: {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'ID продюсера',
                },
                RatingId: {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'ID рейтинга',
                },
                SkipParam: {
                    in: 'query',
                    name: 'skip',
                    schema: {
                        type: 'integer',
                        minimum: 0,
                    },
                    description: 'Количество пропускаемых элементов',
                },
                LimitParam: {
                    in: 'query',
                    name: 'limit',
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 100,
                    },
                    description: 'Максимальное количество возвращаемых элементов',
                },
            },
            responses: {
                NotFound: {
                    description: 'Ресурс не найден',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
                ValidationError: {
                    description: 'Ошибка валидации',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
        },
    },
    apis: [
        `${controllerPath}/movie/movie.controller.ts`,
        `${controllerPath}/producer/producer.controller.ts`,
        `${controllerPath}/rating/rating.controller.ts`,
    ],
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Movie Rating System API',
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, swaggerOptions));

export default router;