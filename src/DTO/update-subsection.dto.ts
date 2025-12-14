import { IsOptional, IsString, IsInt, IsNumber } from "class-validator";

export class UpdateSubsectionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  sectionId?: number;

  @IsOptional()
  @IsNumber()
  order?: number;
}