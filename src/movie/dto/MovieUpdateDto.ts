import {
    IsString,
    IsInt,
    IsOptional,
    Min,
    Max,
    IsArray,
    ArrayNotEmpty,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Expose } from 'class-transformer';
import {
    MIN_RELEASE_YEAR,
    MAX_RELEASE_YEAR,
    MIN_DURATION,
    MAX_DURATION,
} from '../movie.model';

export class MovieUpdateDto {
    @Expose()
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    title?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(MIN_RELEASE_YEAR)
    @Max(MAX_RELEASE_YEAR)
    releaseYear?: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(MIN_DURATION)
    @Max(MAX_DURATION)
    duration?: number;

    @Expose()
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    genre?: string[];

    @Expose()
    @IsOptional()
    @IsString()
    @MinLength(1)
    producerId?: string;
}