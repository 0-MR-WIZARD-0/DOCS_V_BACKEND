import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Section } from '../sections/section.entity';
import { Subsection } from '../subsections/subsection.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Section, section => section.documents, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sectionId' })
  section: Section;

  @Column()
  sectionId: number;

  @ManyToOne(() => Subsection, subsection => subsection.documents, {
  nullable: true,
  onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subsectionId' })
  subsection?: Subsection;

  @Column({ nullable: true })
  subsectionId?: number | null;

  @Column({ nullable: true })
  filename?: string;

  @Column({ nullable: true })
  path?: string;

  @Column({ type: 'date' })
  createdAt: Date;

  @Column({ type: 'int', default: 1 })
  order: number;
}