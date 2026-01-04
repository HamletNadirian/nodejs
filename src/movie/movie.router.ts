import express from 'express';
import {
    createMovie,
    getMovie,
    getAllMovies,
    deleteMovie,
    updateMovie,
} from "./movie.controller";

import validateDto from '../middleware/validateDto';
import {MovieCreateDto} from "./dto/MovieCreateDto";
import {MovieUpdateDto} from "./dto/MovieUpdateDto";

const router = express.Router();

router.post('', validateDto(MovieCreateDto), createMovie)
router.get('/:id', getMovie);
router.get('',getAllMovies);
router.patch('/:id', validateDto(MovieUpdateDto), updateMovie);
router.delete('/:id', deleteMovie);

export default router;