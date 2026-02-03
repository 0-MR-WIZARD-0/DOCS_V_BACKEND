import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { UPLOADS_DIR } from './config/multer.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.get('ORIGIN'),
    credentials: true,
  });

  app.use(cookieParser());

  app.useStaticAssets(UPLOADS_DIR, {
    prefix: '/uploads',
  });

  const port = config.get<number>('PORT', 4000);

  await app.listen(port, '0.0.0.0');
}

bootstrap();