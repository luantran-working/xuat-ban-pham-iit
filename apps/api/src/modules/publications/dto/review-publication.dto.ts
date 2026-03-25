import { IsNotEmpty, IsString } from 'class-validator';

export class ReviewPublicationDto {
  @IsString()
  @IsNotEmpty()
  note!: string;
}
