import { Expose, Transform } from 'class-transformer';

export class ProducerDto {
    @Expose()
    @Transform((params) => params.obj._id.toString())
    _id!: string;

    @Expose()
    name!: string;

    @Expose()
    country?: string;

    @Expose()
    foundedYear?: number;

    @Expose()
    website?: string;

    @Expose()
    bio?: string;

    @Expose()
    @Transform((params) => params.obj.createdAt)
    createdAt!: Date;

    @Expose()
    @Transform((params) => params.obj.updatedAt)
    updatedAt!: Date;
}