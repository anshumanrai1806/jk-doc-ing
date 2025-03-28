import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class DocumentEntity {  // ✅ Renamed to avoid conflict
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  userId?: number;

  @Column({ nullable: true })
  filename?: string;

  @Column({ nullable: true })
  filePath?: string;

  @Column({ nullable: true })
  mimeType?: string;

  @Column('text', { array: true, nullable: true })
  fileChunks?: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
