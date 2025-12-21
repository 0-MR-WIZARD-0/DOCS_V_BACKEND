import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Subsection } from './subsection.entity';
import { Section } from '../sections/section.entity';

import { SubsectionService } from './subsection.service';
import { SubsectionController } from './subsection.controller';
import { DocumentsModule } from 'src/documents/documents.module';
import { Document } from 'src/documents/documents.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subsection, Section, Document]),
    DocumentsModule
  ],
  controllers: [SubsectionController],
  providers: [SubsectionService],
  exports: [SubsectionService],
})
export class SubsectionModule {}