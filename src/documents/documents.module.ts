import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DocumentsController } from './documents.controller'
import { DocumentsService } from './documents.service'
import { Document } from './documents.entity'
import { Category } from "../categories/category.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Document, Category])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}