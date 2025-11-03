import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  title?: string

  @Column()
  filename: string

  @Column()
  path: string

  @CreateDateColumn()
  createdAt: Date
}