import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateDocumentBodyDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category: string;

  @IsDateString()
  createdAt: string;
}
