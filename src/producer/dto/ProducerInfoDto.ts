import { Expose, Transform } from 'class-transformer';

export class ProducerInfoDto {
    @Expose()
    @Transform((params) => params.obj._id.toString())
    _id!: string;

    @Expose()
    name!: string;

    @Expose()
    country?: string;

    @Expose()
    @Transform(({ obj }) => `${obj.name}${obj.country ? ` (${obj.country})` : ''}`)
    displayName!: string;
}