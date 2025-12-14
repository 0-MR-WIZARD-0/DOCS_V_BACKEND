import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Section } from "src/sections/section.entity";
import { Subsection } from "src/subsections/subsection.entity";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { FileService } from "src/files/file.service";
import { Document } from "./documents.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Section, Subsection]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, FileService],
})
export class DocumentsModule {}