import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './documents.entity';
import { CreateDocumentDto } from '../DTO/create-document.dto';
import { UpdateDocumentDto } from '../DTO/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private repo: Repository<Document>,
  ) {}

  async create(dto: { filename: string; title?: string; path: string }) {
  const doc = this.repo.create(dto);
  return this.repo.save(doc);
}


  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: number, updateDto: UpdateDocumentDto) {
    const doc = await this.repo.findOneBy({ id });
    if (!doc) throw new Error('Document not found');

    if (updateDto.title) doc.title = updateDto.title;
    if (updateDto.file) {
      doc.filename = updateDto.file.originalname;
      doc.path = `uploads/${updateDto.file.filename}`;
    }

    return this.repo.save(doc);
  }
}
