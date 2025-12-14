import { IsNotEmpty, IsOptional, IsString, IsNumber } from "class-validator";

export class CreateSectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
