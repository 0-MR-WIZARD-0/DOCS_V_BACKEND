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
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

import { CreateDocumentBodyDto } from '../DTO/create-document-body.dto';
import { UpdateDocumentBodyDto } from '../DTO/update-document-body.dto';

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
    @Body(new ValidationPipe({ whitelist: true })) body: CreateDocumentBodyDto,
  ) {
    const dto: CreateDocumentDto = {
      ...body,
      file,
    };

    return this.service.create(dto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: UpdateDocumentBodyDto,
  ) {
  const dto: UpdateDocumentDto = {
    ...body,
    file,
  };

  return this.service.update(id, dto);
}

  @Get('search')
  async search(
    @Query('title') title?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('category') category?: string,
  ) {
    return this.service.search(title, from, to, category);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}