import { Controller, Get, Post, Put, Param, UploadedFile, Body, UseInterceptors, Query, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from '../DTO/create-document.dto';
import { UpdateDocumentDto } from '../DTO/update-document.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
  
 @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${randomSuffix}${ext}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title?: string; description?: string; category: string; createdAt: string },
  ) {
    const dto: CreateDocumentDto = {
      title: body.title,
      description: body.description,
      category: body.category,
      createdAt: body.createdAt,
      file,
    };
    return this.service.create(dto);
  }
  
  @Put(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${randomSuffix}${ext}`);
      },
    }),
  }))
  async update(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() body?: any,
  ) {
    const dto: UpdateDocumentDto = {
      title: body?.title,
      description: body?.description,
      category: body?.category,
      createdAt: body?.createdAt,
      file,
    };
    return this.service.update(Number(id), dto);
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
  async remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}