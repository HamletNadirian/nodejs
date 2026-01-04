import {
    IsString,
    IsInt,
    IsOptional,
    Min,
    Max,
    IsUrl,
    IsNotEmpty,
    MaxLength,
    MinLength,
    Matches,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class ProducerCreateDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(200)
    name!: string;

    @Expose()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    country?: string;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(1800)
    @Max(new Date().getFullYear())
    foundedYear?: number;

    @Expose()
    @IsOptional()
    @IsString()
    @MaxLength(200)
    @Matches(/^https?:\/\/.+/, { message: 'Website must be a valid URL' })
    website?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    bio?: string;
}