import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './documents.entity';
import { CreateDocumentDto } from '../DTO/create-document.dto';
import { UpdateDocumentDto } from '../DTO/update-document.dto';
import { Category } from '../categories/category.entity';
import * as path from 'path';
import { unlinkSync, existsSync } from 'fs';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private repo: Repository<Document>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  private async getOrCreateCategory(name: string): Promise<Category> {
    const existing = await this.categoryRepo.findOne({
      where: { name: name.toLowerCase() },
    });

    if (existing) return existing;

    const newCat = this.categoryRepo.create({ name: name.toLowerCase() });
    return await this.categoryRepo.save(newCat);
  }

  async create(dto: CreateDocumentDto) {
     const categoryName = dto.category
    ? await this.getOrCreateCategory(dto.category)
    : null;

  const docData: Partial<Document> = {
    title: dto.title,
    description: dto.description,
    category: categoryName,
    filename: dto.file?.originalname ?? null,
    path: dto.file ? `uploads/${dto.file.filename}` : null,
  };

  if (dto.createdAt) {
    const parsedDate = new Date(dto.createdAt);
    if (!isNaN(parsedDate.getTime())) {
      docData.createdAt = parsedDate;
    }
  }

  const doc = this.repo.create(docData);
  return this.repo.save(doc);
  }

  async findAll() {
    return this.repo.find({ 
        relations: ["category"],
        order: { createdAt: 'DESC' } 
    });
  }

  async update(id: number, updateDto: UpdateDocumentDto) {
    const doc = await this.repo.findOneBy({ id });
    if (!doc) throw new NotFoundException('Document not found');

    if (updateDto.title) doc.title = updateDto.title;
    if (updateDto.description) doc.description = updateDto.description;
    if (updateDto.createdAt) doc.createdAt = new Date(updateDto.createdAt);

    if (updateDto.category) {
      doc.category = await this.getOrCreateCategory(updateDto.category);
    }

    if (updateDto.file) {
      if (doc.path) {
        const oldFilePath = path.join(process.cwd(), doc.path);
        if (existsSync(oldFilePath)) unlinkSync(oldFilePath);
      }

      doc.filename = updateDto.file.originalname;
      doc.path = `uploads/${updateDto.file.filename}`;
    }

    return this.repo.save(doc);
  }

  async remove(id: number) {
    const doc = await this.repo.findOne({ where: { id } });

    if (!doc) throw new NotFoundException('Документ не найден');

    if (doc.path) {
      const filePath = path.join(process.cwd(), doc.path);
      if (existsSync(filePath)) unlinkSync(filePath);
    }

    await this.repo.delete(id);
    return { message: 'Документ удалён успешно' };
  }

  async search(title?: string, from?: string, to?: string, category?: string) {
    const query = this.repo.createQueryBuilder('document');

    if (title) {
      query.andWhere('LOWER(document.title) LIKE LOWER(:title)', { 
        title: `%${title.toLowerCase()}%` 
      });
    }
    if (from) {
      query.andWhere('document.createdAt >= :from', { from });
    }
    if (to) {
      query.andWhere('document.createdAt <= :to', { to });
    }
    if (category) {
      query.andWhere('document.category = :category', { category: category.toLowerCase() });
    }
    return query.orderBy('document.createdAt', 'DESC').getMany();
  }
}
