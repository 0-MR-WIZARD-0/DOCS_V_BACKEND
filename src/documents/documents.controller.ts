import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  UploadedFile,
  Body,
  UseInterceptors,
  Query,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

import { CreateDocumentDto } from '../DTO/create-document.dto';
import { UpdateDocumentDto } from '../DTO/update-document.dto';

import { storage, fileFilter } from '../config/multer.config';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('data') raw: string,
  ) {
    const parsed = JSON.parse(raw);

    const body = await new ValidationPipe({
      whitelist: true,
      transform: true,
    }).transform(parsed, {
      type: 'body',
      metatype: CreateDocumentDto,
    });

    const dto: CreateDocumentDto = { ...body, file };
    return this.service.create(dto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('data') raw: string,
  ) {
    let parsed = {};

  try {
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    throw new BadRequestException("Invalid JSON in 'data'");
  }

  const dto = await new ValidationPipe({
    whitelist: true,
    transform: true,
  }).transform(parsed, {
    type: 'body',
    metatype: UpdateDocumentDto,
  });

  return this.service.update(id, { ...dto, file });
}


@Put(':id/move/:order')

  async move(
    @Param('id', ParseIntPipe) id: number,
    @Param('order', ParseIntPipe) newOrder: number
  ) {
  return this.service.move(id, newOrder);
  }

  @Get('search')
  async search(
    @Query('title') title?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.search(title, from, to);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

}