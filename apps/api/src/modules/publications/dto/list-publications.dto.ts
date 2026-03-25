import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PublicationStatus } from '../publication-status';

export class ListPublicationsDto {
  @IsOptional()
  @IsString()
  search?: string;
}

export class ListAdminPublicationsDto extends ListPublicationsDto {
  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus;
}
