import express from 'express';
import {
    createProducer,
    getProducer,
    getAllProducers,
    updateProducer,
    deleteProducer,
} from './producer.controller';
import validateDto from '../middleware/validateDto';
import { ProducerCreateDto } from './dto/ProducerCreateDto';
import { ProducerUpdateDto } from './dto/ProducerUpdateDto';

const router = express.Router();

router.post('', validateDto(ProducerCreateDto), createProducer);

router.get('/:id', getProducer);

router.get('', getAllProducers);

router.patch('/:id', validateDto(ProducerUpdateDto), updateProducer);

router.delete('/:id', deleteProducer);

export default router;