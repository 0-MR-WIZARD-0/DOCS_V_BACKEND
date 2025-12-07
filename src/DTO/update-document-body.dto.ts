import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class UpdateDocumentBodyDto {
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
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  removeFile?: boolean;
}
