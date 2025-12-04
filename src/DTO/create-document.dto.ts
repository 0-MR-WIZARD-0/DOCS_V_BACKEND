import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category: string;

  @IsDateString()
  createdAt: string;

  file?: Express.Multer.File;
}