import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @IsOptional()
  file?: Express.Multer.File;
}