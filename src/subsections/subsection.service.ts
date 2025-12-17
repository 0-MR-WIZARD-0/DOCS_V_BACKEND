import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subsection } from './subsection.entity';
import { CreateSubsectionDto } from '../DTO/create-subsection.dto';
import { UpdateSubsectionDto } from '../DTO/update-subsection.dto';

@Injectable()
export class SubsectionService {
  constructor(
    @InjectRepository(Subsection)
    private subsectionRepo: Repository<Subsection>,
  ) {}

  async findAll() {
    return this.subsectionRepo.find({ relations: ['section'], order: { order: 'ASC' } });
  }

  async create(dto: CreateSubsectionDto) {
    const maxOrder = await this.subsectionRepo
      .createQueryBuilder('subsection')
      .where('subsection.sectionId = :sectionId', { sectionId: dto.sectionId })
      .select('MAX(subsection.order)', 'max')
      .getRawOne();

    const order = dto.order ?? (maxOrder?.max ?? 0) + 1;

    const subsection = this.subsectionRepo.create({ ...dto, order });
    return this.subsectionRepo.save(subsection);
  }

  async update(id: number, dto: UpdateSubsectionDto) {
    const subsection = await this.subsectionRepo.findOne({ where: { id } });
    if (!subsection) throw new NotFoundException('Subsection not found');

    this.subsectionRepo.merge(subsection, dto);
    return this.subsectionRepo.save(subsection);
  }

  async move(id: number, newOrder: number) {
    const subsection = await this.subsectionRepo.findOne({ where: { id }, relations: ['section'] });
    if (!subsection) throw new NotFoundException('Subsection not found');

    const subsections = await this.subsectionRepo.find({
      where: { section: { id: subsection.section.id } },
      order: { order: 'ASC' },
    });

    const minOrder = 1;
    const maxOrder = subsections.length;
    if (newOrder < minOrder) newOrder = minOrder;
    if (newOrder > maxOrder) newOrder = maxOrder;

    const otherSubs = subsections.filter(s => s.id !== id);
    otherSubs.forEach((s, index) => {
      if (index + 1 >= newOrder) s.order = index + 2;
      else s.order = index + 1;
    });

    subsection.order = newOrder;

    await this.subsectionRepo.save([...otherSubs, subsection]);
    return subsection;
  }

  async remove(id: number) {
    const subsection = await this.subsectionRepo.findOne({ where: { id }, relations: ['documents'] });
    if (!subsection) throw new NotFoundException('Subsection not found');

    await Promise.all(subsection.documents.map(doc => doc.id && this.subsectionRepo.manager.delete('Document', doc.id)));

    return this.subsectionRepo.delete(id);
  }
}