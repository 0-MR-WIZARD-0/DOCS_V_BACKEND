import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm'
import { Category } from '../categories/category.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  title?: string

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Category, (category) => category.documents, { nullable: true })
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @Column({ nullable: true })
  filename?: string;

  @Column({ nullable: true })
  path?: string;

  @Column({type: "date"})
  createdAt: Date
}