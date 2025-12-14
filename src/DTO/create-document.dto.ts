import { IsOptional, IsString, IsInt } from 'class-validator';
import { Express } from 'express';

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  sectionId?: number;

  @IsOptional()
  @IsInt()
  subsectionId?: number;

  @IsOptional()
  file?: Express.Multer.File;

  @IsOptional()
  createdAt?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}