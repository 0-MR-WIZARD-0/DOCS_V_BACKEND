import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AdminService } from '../admin/admin.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const adminService = app.get(AdminService);
  const config = app.get(ConfigService);

  const username = config.get<string>('ADMIN_LOGIN');
  const password = config.get<string>('ADMIN_PASSWORD');

  if (!username || !password) {
    console.error('ADMIN_LOGIN или ADMIN_PASSWORD не заданы');
    await app.close();
    process.exit(1);
  }

  const exists = await adminService.findByUsername(username);

  if (exists) {
    console.log('Админ уже существует — seed пропущен');
    await app.close();
    return;
  }

  await adminService.createAdmin({ username, password });

  console.log('Админ успешно создан');
  await app.close();
}

bootstrap();