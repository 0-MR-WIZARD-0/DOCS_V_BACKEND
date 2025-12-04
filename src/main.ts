import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, 
  })
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  await app.listen(4000)
}

bootstrap()