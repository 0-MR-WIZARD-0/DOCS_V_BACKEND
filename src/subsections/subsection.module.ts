import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Subsection } from './subsection.entity';
import { Section } from '../sections/section.entity';

import { SubsectionService } from './subsection.service';
import { SubsectionController } from './subsection.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subsection, Section]),
  ],
  controllers: [SubsectionController],
  providers: [SubsectionService],
  exports: [SubsectionService],
})
export class SubsectionModule {}