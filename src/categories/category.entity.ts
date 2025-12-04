import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Document } from '../documents/documents.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Document, (doc) => doc.category)
  documents: Document[];
}