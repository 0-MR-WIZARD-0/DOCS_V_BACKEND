import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subsection } from '../subsections/subsection.entity';
import { Document } from '../documents/documents.entity';

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Subsection, subsection => subsection.section, {
    cascade: ['remove'],
    onDelete: 'CASCADE'
  })
  subsections: Subsection[];

  @OneToMany(() => Document, doc => doc.section, {
    cascade: ['remove'],
    onDelete: 'CASCADE'
  })
  documents: Document[];

  @Column({ type: 'int', default: 0 })
  order: number;
}
