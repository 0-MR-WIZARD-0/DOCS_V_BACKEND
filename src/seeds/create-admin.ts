import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AdminService } from '../admin/admin.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const adminService = app.get(AdminService);

  const username = process.env.ADMIN_LOGIN;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('ADMIN_LOGIN или ADMIN_PASSWORD не указаны в .env');
    process.exit(1);
  }

  const exists = await adminService.findByUsername(username);

  if (exists) {
    console.log('Админ уже существует, seed skip.');
    await app.close();
    return;
  }

  await adminService.createAdmin({ username, password });

  console.log('Admin add!');
  await app.close();
}

bootstrap();
