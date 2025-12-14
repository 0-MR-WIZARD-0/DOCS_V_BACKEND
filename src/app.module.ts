import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Admin } from './admin/admin.entity'
import { AdminModule } from './admin/admin.module'
import { AuthModule } from './auth/auth.module'
import { Section } from './sections/section.entity'
import { SectionModule } from './sections/section.module'
import { Subsection } from './subsections/subsection.entity'
import { SubsectionModule } from './subsections/subsection.module'
import { Document } from './documents/documents.entity'
import { DocumentsModule } from './documents/documents.module'

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: false,
        entities: [Admin, Document, Section, Subsection]
      }),
      inject: [ConfigService],
    }),
    AdminModule,
    AuthModule,
    DocumentsModule,
    SectionModule,
    SubsectionModule
  ],
})
export class AppModule {}