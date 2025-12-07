import { CreateDocumentDto } from '../DTO/create-document.dto';
import { Category } from '../categories/category.entity';

export const mapDtoToDocument = (
  dto: CreateDocumentDto,
  category: Category,
) => ({
  title: dto.title,
  description: dto.description ?? null,
  createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
  category,
  filename: dto.file?.originalname ?? null,
  path: dto.file ? `uploads/${dto.file.filename}` : null,
});