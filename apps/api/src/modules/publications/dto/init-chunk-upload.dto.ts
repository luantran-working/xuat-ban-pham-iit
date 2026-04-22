import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class InitChunkUploadFileDto {
  @IsString()
  @IsNotEmpty()
  originalName!: string;

  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  size!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  chunkSize!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  chunkCount!: number;
}

export class InitChunkUploadDto {
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

  @ValidateNested({ each: true })
  @Type(() => InitChunkUploadFileDto)
  @ArrayMinSize(1)
  files!: InitChunkUploadFileDto[];
}

export type InitChunkUploadFileInput = InitChunkUploadFileDto;
