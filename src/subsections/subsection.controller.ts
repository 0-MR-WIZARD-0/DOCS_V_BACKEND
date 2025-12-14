import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { SubsectionService } from './subsection.service';
import { CreateSubsectionDto } from '../DTO/create-subsection.dto';
import { UpdateSubsectionDto } from '../DTO/update-subsection.dto';

@Controller('subsections')
export class SubsectionController {
  constructor(private readonly service: SubsectionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateSubsectionDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubsectionDto) {
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