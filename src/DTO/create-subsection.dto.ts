// create-subsection.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsInt, IsNumber } from "class-validator";

export class CreateSubsectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  sectionId: number;

  @IsOptional()
  @IsNumber()
  order?: number;
}
