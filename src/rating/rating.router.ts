import express from 'express';
import {
    createRating,
    getRatingsByMovieId,
    getRatingCounts,
    getAverageRating,
} from './rating.controller';
import validateDto from '../middleware/validateDto';
import { RatingCreateDto } from './dto/RatingCreateDto';
import { RatingCountsDto } from './dto/RatingCountsDto';

const router = express.Router();

router.post('', validateDto(RatingCreateDto), createRating);

router.get('', getRatingsByMovieId);

router.post('/_counts', validateDto(RatingCountsDto), getRatingCounts);

router.get('/:movieId/average', getAverageRating);

export default router;