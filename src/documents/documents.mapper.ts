import { CreateDocumentDto } from "../DTO/create-document.dto";

export const mapDtoToDocument = (dto: CreateDocumentDto) => ({
  title: dto.title,
  description: dto.description ?? null,
  createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
  filename: dto.file?.originalname ?? null,
  path: dto.file ? `uploads/${dto.file.filename}` : null,
  order: dto.order ?? 0,
});