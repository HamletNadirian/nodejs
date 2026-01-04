import { BaseQueryDto } from '../../common/dto/BaseQueryDto';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class RatingQueryDto extends BaseQueryDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    movieId!: string;
}