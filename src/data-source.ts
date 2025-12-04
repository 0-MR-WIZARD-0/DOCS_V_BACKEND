import { DataSource } from 'typeorm';
import { Admin } from './admin/admin.entity';
import { Document } from './documents/documents.entity';
import { Category } from './categories/category.entity';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Admin, Document, Category],
  migrations: ['src/migrations/*.ts'],
  synchronize: false
});
