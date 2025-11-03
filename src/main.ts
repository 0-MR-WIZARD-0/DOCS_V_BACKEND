import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import * as express from 'express'
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  console.log(process.env.DB_USER);
  
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')))
  await app.listen(4000)
}
bootstrap()