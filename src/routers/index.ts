import express from 'express';
import movieRouter from '../movie/movie.router';
import producerRouter from '../producer/producer.router';
import ratingRouter from '../rating/rating.router';
import swaggerRouter from '../swagger/swagger.router';

const router = express.Router();

router.use('/api/movies', movieRouter);
router.use('/api/producers', producerRouter);
router.use('/api/ratings', ratingRouter);
router.use('/api-docs', swaggerRouter);

export default router;