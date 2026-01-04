import { Expose, Transform } from 'class-transformer';

export class RatingDto {
    @Expose()
    @Transform((params) => params.obj._id.toString())
    _id!: string;

    @Expose()
    @Transform((params) => params.obj.movieId.toString())
    movieId!: string;

    @Expose()
    score!: number;

    @Expose()
    comment?: string;

    @Expose()
    createdBy?: string;

    @Expose()
    @Transform((params) => params.obj.createdAt)
    createdAt!: Date;
}