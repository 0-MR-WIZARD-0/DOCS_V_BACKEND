import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Document } from './documents.entity';
import { Section } from '../sections/section.entity';
import { Subsection } from '../subsections/subsection.entity';

import { CreateDocumentDto } from '../DTO/create-document.dto';
import { UpdateDocumentDto } from '../DTO/update-document.dto';

import { FileService } from '../files/file.service';
import { mapDtoToDocument } from './documents.mapper';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private repo: Repository<Document>,

    @InjectRepository(Section)
    private sectionRepo: Repository<Section>,

    @InjectRepository(Subsection)
    private subsectionRepo: Repository<Subsection>,

    private readonly fileService: FileService,
  ) {}

  private async validateSectionSub(dto: CreateDocumentDto | UpdateDocumentDto) {
    let section = null;
    let subsection = null;

    if (!dto.sectionId && !dto.subsectionId) {
      throw new BadRequestException('Document must belong to either a section or a subsection.');
    }

    if (dto.sectionId) {
      section = await this.sectionRepo.findOne({ where: { id: dto.sectionId } });
      if (!section) throw new NotFoundException('Section not found');
    }

    if (dto.subsectionId) {
      subsection = await this.subsectionRepo.findOne({
        where: { id: dto.subsectionId },
        relations: ['section'],
      });

      if (!subsection) throw new NotFoundException('Subsection not found');
      section = subsection.section;
    }

    return { section, subsection };
  }

  private async shiftOrders(sectionId: number, subsectionId: number | null, fromOrder: number, excludeId?: number) {
    const query = this.repo
      .createQueryBuilder()
      .update(Document)
      .set({ order: () => `"order" + 1` })
      .where('"order" >= :fromOrder', { fromOrder })
      .andWhere('sectionId = :sectionId', { sectionId });

    if (subsectionId) query.andWhere('subsectionId = :subsectionId', { subsectionId });
    else query.andWhere('subsectionId IS NULL');

    if (excludeId) query.andWhere('id != :excludeId', { excludeId });

    await query.execute();
  }

  async create(dto: CreateDocumentDto) {
    const { section, subsection } = await this.validateSectionSub(dto);

    let order = dto.order;
    if (!order || order < 1) {
      const maxOrder = await this.repo
        .createQueryBuilder('d')
        .select('MAX(d.order)', 'max')
        .where('d.sectionId = :sectionId', { sectionId: section.id })
        .andWhere(subsection ? 'd.subsectionId = :subId' : 'd.subsectionId IS NULL', { subId: subsection?.id })
        .getRawOne();

      order = (maxOrder?.max ?? 0) + 1;
    } else {
      await this.shiftOrders(section.id, subsection?.id ?? null, order);
    }

    const docData = mapDtoToDocument({ ...dto, order });
    const doc = this.repo.create({ ...docData, section, subsection });

    return this.repo.save(doc);
  }

  async update(id: number, dto: UpdateDocumentDto) {

    if (!dto) {
      throw new BadRequestException('Update DTO is undefined');
    }

    const doc = await this.repo.findOne({
      where: { id },
      relations: ['section', 'subsection'],
    });

    if (!doc) throw new NotFoundException('Document not found');

    if (dto.sectionId !== undefined || dto.subsectionId !== undefined) {
      const { section, subsection } = await this.validateSectionSub(dto);
      doc.section = section;
      doc.subsection = subsection;
    }

    if (dto.order !== undefined && dto.order !== doc.order) {
      await this.shiftOrders(doc.section.id, doc.subsection?.id ?? null, dto.order, doc.id);
      doc.order = dto.order;
    }

    if (dto.file) {
      if (doc.path) await this.fileService.deleteFile(doc.path);
      doc.filename = dto.file.originalname;
      doc.path = `uploads/${dto.file.filename}`;
    }

    if (dto.removeFile && doc.path) {
      await this.fileService.deleteFile(doc.path);
      doc.filename = null;
      doc.path = null;
    }

    doc.title = dto.title ?? doc.title;
    doc.description = dto.description ?? doc.description;
    doc.createdAt = dto.createdAt ? new Date(dto.createdAt) : doc.createdAt;

    return this.repo.save(doc);
  }

  async findAll() {
    return this.repo.find({
      relations: ['section', 'subsection'],
      order: {
        section: { order: 'ASC' },
        subsection: { order: 'ASC' },
        order: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async search(queryText?: string, from?: string, to?: string) {
    const q = this.repo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.section', 's')
      .leftJoinAndSelect('d.subsection', 'ss');

    if (queryText) {
      q.andWhere(
        `LOWER(d.title) LIKE LOWER(:q)
        OR LOWER(s.name) LIKE LOWER(:q)
        OR LOWER(ss.name) LIKE LOWER(:q)`,
        { q: `%${queryText}%` },
      );
    }

    if (from) q.andWhere('d.createdAt >= :from', { from });
    if (to) q.andWhere('d.createdAt <= :to', { to });

    return q
      .orderBy('s.order', 'ASC')
      .addOrderBy('ss.order', 'ASC')
      .addOrderBy('d.order', 'ASC')
      .addOrderBy('d.createdAt', 'DESC')
      .getMany();
  }

  async move(id: number, newOrder: number): Promise<void> {
  const doc = await this.repo.findOne({
    where: { id },
    relations: ['section', 'subsection'],
  });

  if (!doc) throw new NotFoundException('Document not found');

  const docs = await this.repo.find({
    where: doc.subsection
      ? { subsection: { id: doc.subsection.id } }
      : { section: { id: doc.section.id }, subsection: null },
    order: { order: 'ASC' },
  });

  if (!docs.length) return;

  const oldIndex = docs.findIndex(d => d.id === id);
  if (oldIndex === -1) return;

  if (newOrder < 0) newOrder = 0;
  if (newOrder > docs.length - 1) newOrder = docs.length - 1;

  const item = docs.splice(oldIndex, 1)[0];
  docs.splice(newOrder, 0, item);

  await this.repo.manager.transaction(async (manager) => {
    for (let idx = 0; idx < docs.length; idx++) {
      const d = docs[idx];
      await manager.update(Document, d.id, { order: idx + 1 });
    }
  });
}

  async remove(id: number) {
    const doc = await this.repo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    if (doc.path) await this.fileService.deleteFile(doc.path);
    await this.repo.delete(id);

    return { message: 'Document deleted successfully' };
  }
}