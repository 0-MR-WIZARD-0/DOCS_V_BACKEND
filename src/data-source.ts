import { DataSource } from 'typeorm';
import { Admin } from './admin/admin.entity';
import { Document } from './documents/documents.entity';
import { Section } from './sections/section.entity';
import 'dotenv/config';
import { Subsection } from './subsections/subsection.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Admin, Document, Section, Subsection],
  migrations: ['src/migrations/*.{ts,js}'],
  synchronize: false
});
