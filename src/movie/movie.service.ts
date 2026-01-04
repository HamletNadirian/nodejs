import { MovieCreateDto } from './dto/MovieCreateDto';
import { MovieDto } from './dto/MovieDto';
import { MovieUpdateDto } from './dto/MovieUpdateDto';
import * as movieRepository from './movie.repository';
import * as producerService from '../producer/producer.service';
import { plainToInstance } from 'class-transformer';
import { ValidationException } from '../exceptions/ValidationException';
import { NotFoundException } from '../exceptions/NotFoundException';
import { isIdValid } from '../common/validators/validateDocumentId';

export const create = async (createDto: MovieCreateDto): Promise<string> => {
    await validateProducerId(createDto.producerId);
    return movieRepository.create(createDto);
};

export const getById = async (id: string): Promise<MovieDto> => {
    if (!isIdValid(id)) {
        throw new ValidationException(`Movie id ${id} is invalid`);
    }

    const movie = await movieRepository.getById(id);

    if (!movie) {
        throw new NotFoundException(`Movie with id ${id} not found`);
    }

    return plainToInstance(MovieDto, movie, { excludeExtraneousValues: true });
};

export const getAll = async (skip: number = 0, limit: number = 10): Promise<MovieDto[]> => {
    const movies = await movieRepository.getAll(skip, limit);
    return movies.map(movie =>
        plainToInstance(MovieDto, movie, { excludeExtraneousValues: true })
    );
};

export const update = async (id: string, updateDto: MovieUpdateDto): Promise<void> => {
    if (!isIdValid(id)) {
        throw new ValidationException(`Movie id ${id} is invalid`);
    }

    if (updateDto.producerId) {
        await validateProducerId(updateDto.producerId);
    }

    await movieRepository.update(id, updateDto);
};

export const remove = async (id: string): Promise<void> => {
    if (!isIdValid(id)) {
        throw new ValidationException(`Movie id ${id} is invalid`);
    }
    await movieRepository.remove(id);
};

export const exists = async (id: string): Promise<boolean> => {
    if (!isIdValid(id)) {
        throw new ValidationException(`Movie id ${id} is invalid`);
    }
    return movieRepository.exists(id);
};

export const validateProducerId = async (id: string): Promise<void> => {
    if (!isIdValid(id)) {
        throw new ValidationException(`Producer id ${id} is invalid`);
    }

    const producerExists = await producerService.exists(id);
    if (!producerExists) {
        throw new ValidationException(`Producer with id ${id} doesn't exists.`);
    }
};