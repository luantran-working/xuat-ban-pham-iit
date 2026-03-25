import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class UploadPublicationDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  publishYear!: number;

  @IsDateString()
  copyrightExpiryDate!: string;
}
