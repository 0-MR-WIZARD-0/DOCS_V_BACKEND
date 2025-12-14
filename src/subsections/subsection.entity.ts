import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Section } from '../sections/section.entity';
import { Document } from '../documents/documents.entity';

@Entity()
export class Subsection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;
  
  @ManyToOne(() => Section, section => section.subsections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sectionId' })
  section: Section;
  
  @Column()
  sectionId: number;

  @OneToMany(() => Document, doc => doc.subsection, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  documents: Document[];

  @Column({ type: 'int', default: 0 })
  order: number;
}
