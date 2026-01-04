import {ProducerCreateDto} from './dto/ProducerCreateDto';
import {ProducerDto} from './dto/ProducerDto';
import {ProducerUpdateDto} from './dto/ProducerUpdateDto';
import * as producerRepository from './producer.repository';
import {plainToInstance} from 'class-transformer';
import {ValidationException} from '../exceptions/ValidationException';
import {NotFoundException} from '../exceptions/NotFoundException';
import {isIdValid} from '../common/validators/validateDocumentId';

export const create = async (createDto: ProducerCreateDto): Promise<string> => {
    return producerRepository.create(createDto);
};

export const getById = async (id: string): Promise<ProducerDto> => {
    if (!isIdValid(id)) {
        throw new ValidationException(`Producer id ${id} is invalid`);
    }

    const producer = await producerRepository.getById(id);

    if (!producer) {
        throw new NotFoundException(`Producer with id ${id} not found`);
    }

    return plainToInstance(ProducerDto, producer, {excludeExtraneousValues: true});
};

export const getAll = async (skip: number = 0, limit: number = 10): Promise<ProducerDto[]> => {
    const producers = await producerRepository.getAll(skip, limit);
    return producers.map(producer =>
        plainToInstance(ProducerDto, producer, {excludeExtraneousValues: true})
    );
};

export const update = async (id: string, updateDto: ProducerUpdateDto): Promise<void> => {
    if (!isIdValid(id)) {
        throw new ValidationException(`Producer id ${id} is invalid`);
    }

    const producerExists = await producerRepository.exists(id);
    if (!producerExists) {
        throw new NotFoundException(`Producer with id ${id} not found`);
    }

    await producerRepository.update(id, updateDto);
};

export const remove = async (id: string): Promise<void> => {
    if (!isIdValid(id)) {
        throw new ValidationException(`Producer id ${id} is invalid`);
    }

    const producerExists = await producerRepository.exists(id);
    if (!producerExists) {
        throw new NotFoundException(`Producer with id ${id} not found`);
    }

    const hasMovies = await producerRepository.hasMovies(id);
    if (hasMovies) {
        throw new ValidationException(`Cannot delete producer with existing movies`);
    }

    await producerRepository.remove(id);
};

export const exists = async (id: string): Promise<boolean> => {
    if (!isIdValid(id)) {
        throw new ValidationException(`Producer id ${id} is invalid`);
    }
    return await producerRepository.exists(id);
};