
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  location: string;

  @Column()
  type: string;

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column('text')
  description: string;

  @Column('text', { array: true })
  images: string[];

  @Column('text', { array: true })
  videos: string[];

  @Column('text', { nullable: true })
  floorPlan: string;

  @Column('text', { array: true })
  features: string[];

  @Column()
  squareFootage: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
