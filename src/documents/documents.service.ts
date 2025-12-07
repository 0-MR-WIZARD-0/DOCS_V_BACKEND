import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Document } from './documents.entity';
import { Category } from '../categories/category.entity';

import { CreateDocumentDto } from '../DTO/create-document.dto';
import { UpdateDocumentDto } from '../DTO/update-document.dto';

import { FileService } from '../files/file.service';
import { mapDtoToDocument } from './documents.mapper';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private repo: Repository<Document>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,

    private readonly fileService: FileService,
  ) {}

  private async getOrCreateCategory(name: string): Promise<Category> {
    const existing = await this.categoryRepo.findOne({
      where: { name: name.toLowerCase() },
    });

    if (existing) return existing;

    const newCat = this.categoryRepo.create({ name: name.toLowerCase() });
    return this.categoryRepo.save(newCat);
  }

  async create(dto: CreateDocumentDto) {
    const category = await this.getOrCreateCategory(dto.category);

    if (dto.title) {
      const existing = await this.repo.findOne({
        where: { title: dto.title, category: { id: category.id } },
        relations: ['category'],
      });
      if (existing) {
        throw new BadRequestException(
          `Document with title "${dto.title}" already exists in category "${category.name}".`
        );
      }
    }

    const data = mapDtoToDocument(dto, category);
    const doc = this.repo.create(data);
    return this.repo.save(doc);
  }

  async findAll() {
    return this.repo.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateDocumentDto) {
    const doc = await this.repo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!doc) throw new NotFoundException('Document not found');

    if (dto.category) {
      const category = await this.getOrCreateCategory(dto.category);

      if (dto.title) {
        const existing = await this.repo.findOne({
          where: { title: dto.title, category: { id: category.id } },
          relations: ['category'],
        });
        if (existing && existing.id !== id) {
          throw new BadRequestException(
            `Document with title "${dto.title}" already exists in category "${category.name}".`
          );
        }
      }

      doc.category = category;
    }

    if (dto.file) {
      await this.fileService.deleteFile(doc.path);
      doc.filename = dto.file.originalname;
      doc.path = `uploads/${dto.file.filename}`;
    } else if (dto.removeFile && doc.path) {
      await this.fileService.deleteFile(doc.path);
      doc.filename = null;
      doc.path = null;
    }

    this.repo.merge(doc, {
      title: dto.title,
      description: dto.description,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : doc.createdAt,
    });

    return this.repo.save(doc);
  }

  async remove(id: number) {
    const doc = await this.repo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    if (doc.path) await this.fileService.deleteFile(doc.path);
    await this.repo.delete(id);

    return { message: 'Document deleted successfully' };
  }

  async search(title?: string, from?: string, to?: string, category?: string) {
    const query = this.repo
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.category', 'category');

    if (title) {
      query.andWhere('LOWER(document.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    if (from) {
      query.andWhere('document.createdAt >= :from', { from });
    }

    if (to) {
      query.andWhere('document.createdAt <= :to', { to });
    }

    if (category) {
      query.andWhere('LOWER(category.name) = LOWER(:cat)', {
        cat: category.toLowerCase(),
      });
    }

    return query.orderBy('document.createdAt', 'DESC').getMany();
  }
}