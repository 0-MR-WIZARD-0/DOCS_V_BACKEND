export class UpdateDocumentDto {
  title?: string;
  file?: Express.Multer.File; // если хотим заменять файл
}
