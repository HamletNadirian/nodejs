import { Expose, Transform } from 'class-transformer';

export class MovieDto {
    @Expose()
    @Transform((params) => params.obj._id.toString())
    _id!: string;

    @Expose()
    title!: string;

    @Expose()
    description!: string;

    @Expose()
    releaseYear!: number;

    @Expose()
    duration!: number;

    @Expose()
    genre!: string[];

    @Expose()
    @Transform((params) => params.obj.producerId.toString())
    producerId!: string;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;

}