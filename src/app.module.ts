import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DocumentsModule } from './documents/documents.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Admin } from './admin/admin.entity'
import { Document } from './documents/documents.entity'
import { AdminModule } from './admin/admin.module'

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
        entities: [Admin, Document]
      }),
      inject: [ConfigService],
    }),
    DocumentsModule,
    AdminModule,
  ],
})
export class AppModule {}