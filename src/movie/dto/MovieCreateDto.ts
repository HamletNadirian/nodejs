import {
    IsString,
    IsInt,
    IsNotEmpty,
    IsOptional,
    Min,
    Max,
    IsArray,
    MaxLength,
    MinLength,
    ArrayNotEmpty, IsIn
} from "class-validator";
import {Expose, Type} from 'class-transformer';
import {
    MAX_TITLE_LENGTH,
    MIN_TITLE_LENGTH,
    MAX_DESCRIPTION_LENGTH,
    MIN_RELEASE_YEAR,
    MAX_RELEASE_YEAR,
    MIN_DURATION,
    MAX_DURATION,
} from "../movie.model";

export class MovieCreateDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @MaxLength(MAX_TITLE_LENGTH)
    @MinLength(MIN_TITLE_LENGTH)
    title!: string;

    @Expose()
    @IsOptional()
    @IsString()
    @MaxLength(MAX_DESCRIPTION_LENGTH)
    description?: string;

    @Expose()
    @IsInt()
    @Min(MIN_RELEASE_YEAR)
    @Max(MAX_RELEASE_YEAR)
    releaseYear!: number;

    @Expose()
    @IsInt()
    @Min(MIN_DURATION)
    @Max(MAX_DURATION)
    duration!: number;

    @Expose()
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({each: true})
    genre?: string[];

    @Expose()
    @IsString()
    @IsNotEmpty()
    producerId!: string;

}

