import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from '../DTO/create-section.dto';
import { UpdateSectionDto } from '../DTO/update-section.dto';

@Controller('sections')
export class SectionController {
  constructor(private readonly service: SectionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateSectionDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSectionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Put(':id/move/:order')
  move(@Param('id', ParseIntPipe) id: number, @Param('order', ParseIntPipe) newOrder: number) {
    return this.service.move(id, newOrder);
  }
}