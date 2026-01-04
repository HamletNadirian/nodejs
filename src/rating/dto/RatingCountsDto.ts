import { Expose } from 'class-transformer';
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class RatingCountsDto {
    @Expose()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    movieIds!: string[];
}