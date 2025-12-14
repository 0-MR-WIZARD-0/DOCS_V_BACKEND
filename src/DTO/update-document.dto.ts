import { IsOptional, IsString, IsInt } from 'class-validator';
import { Express } from 'express';

export class UpdateDocumentDto {
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
  removeFile?: boolean;

  @IsOptional()
  createdAt?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}