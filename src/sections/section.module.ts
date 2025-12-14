import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Section } from './section.entity';
import { Subsection } from '../subsections/subsection.entity';
import { Document } from '../documents/documents.entity';

import { SectionService } from './section.service';
import { SectionController } from './section.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Section, Subsection, Document]),
  ],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}