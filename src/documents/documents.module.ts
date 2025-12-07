import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DocumentsController } from './documents.controller'
import { DocumentsService } from './documents.service'
import { Document } from './documents.entity'
import { Category } from "../categories/category.entity"
import { FileService } from 'src/files/file.service'

@Module({
  imports: [TypeOrmModule.forFeature([Document, Category])],
  controllers: [DocumentsController],
  providers: [DocumentsService, FileService],
})
export class DocumentsModule {}