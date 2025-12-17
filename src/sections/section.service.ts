import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from './section.entity';
import { CreateSectionDto } from '../DTO/create-section.dto';
import { UpdateSectionDto } from '../DTO/update-section.dto';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionRepo: Repository<Section>,
  ) {}

  async findAll() {
  const sections = await this.sectionRepo.find({
    relations: ['subsections', 'subsections.documents', 'documents'],
    order: { order: 'ASC' },
  });

  const structuredSections = sections.map(section => {
    
    const filteredSectionDocs = section.documents.filter(
      doc => doc.subsectionId === null || doc.subsectionId === undefined
    );

    const filteredSubsections = section.subsections.map(sub => ({
      ...sub,
      documents: sub.documents.filter(
        doc => doc.subsectionId === sub.id
      ),
    }));

    return {
      ...section,
      documents: filteredSectionDocs,
      subsections: filteredSubsections,
    };
  });

  return structuredSections;
}

  async create(dto: CreateSectionDto) {
    const maxOrder = await this.sectionRepo
      .createQueryBuilder('section')
      .select('MAX(section.order)', 'max')
      .getRawOne();

    const order = dto.order ?? (maxOrder?.max ?? 0) + 1;

    const section = this.sectionRepo.create({ ...dto, order });
    return this.sectionRepo.save(section);
  }

  async update(id: number, dto: UpdateSectionDto) {
    const section = await this.sectionRepo.findOne({ where: { id } });
    if (!section) throw new NotFoundException('Section not found');

    this.sectionRepo.merge(section, dto);
    return this.sectionRepo.save(section);
  }

  async move(id: number, newOrder: number) {
    const section = await this.sectionRepo.findOne({ where: { id } });
    if (!section) throw new NotFoundException('Section not found');

    const sections = await this.sectionRepo.find({ order: { order: 'ASC' } });

    const minOrder = 1;
    const maxOrder = sections.length;
    if (newOrder < minOrder) newOrder = minOrder;
    if (newOrder > maxOrder) newOrder = maxOrder;

    const otherSections = sections.filter(s => s.id !== id);
    otherSections.forEach((s, index) => {
      if (index + 1 >= newOrder) s.order = index + 2;
      else s.order = index + 1;
    });

    section.order = newOrder;

    await this.sectionRepo.save([...otherSections, section]);
    return section;
  }

  async remove(id: number) {
    const section = await this.sectionRepo.findOne({ where: { id }, relations: ['subsections', 'documents'] });
    if (!section) throw new NotFoundException('Section not found');

    await Promise.all(section.documents.map(doc => doc.id && this.sectionRepo.manager.delete('Document', doc.id)));
    await Promise.all(section.subsections.map(sub => this.sectionRepo.manager.delete('Subsection', sub.id)));

    return this.sectionRepo.delete(id);
  }
}