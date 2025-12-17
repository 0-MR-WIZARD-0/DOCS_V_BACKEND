import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SubsectionService } from './subsection.service';
import { CreateSubsectionDto } from '../DTO/create-subsection.dto';
import { UpdateSubsectionDto } from '../DTO/update-subsection.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('subsections')
export class SubsectionController {
  constructor(private readonly service: SubsectionService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateSubsectionDto) {
    return this.service.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubsectionDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/move/:order')
  move(@Param('id', ParseIntPipe) id: number, @Param('order', ParseIntPipe) newOrder: number) {
    return this.service.move(id, newOrder);
  }
}