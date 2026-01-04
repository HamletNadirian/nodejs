import {
    IsInt,
    IsString,
    IsOptional,
    Min,
    Max,
    MaxLength,
    IsNotEmpty,
    IsDate,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import {
    MIN_RATING_SCORE,
    MAX_RATING_SCORE,
} from '../rating.model';
import {
    RATING_SCORE_TOO_LOW,
    RATING_SCORE_TOO_HIGH,
    RATING_COMMENT_TOO_LONG,
    RATING_CREATEDBY_TOO_LONG,
} from '../rating.errorCodes';

export class RatingCreateDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    movieId!: string;

    @Expose()
    @IsInt()
    @Min(MIN_RATING_SCORE, { message: RATING_SCORE_TOO_LOW })
    @Max(MAX_RATING_SCORE, { message: RATING_SCORE_TOO_HIGH })
    score!: number;

    @Expose()
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: RATING_COMMENT_TOO_LONG })
    comment?: string;

    @Expose()
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => value ? new Date(value) : undefined)
    ratingDate?: Date;

    @Expose()
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: RATING_CREATEDBY_TOO_LONG })
    createdBy?: string;
}