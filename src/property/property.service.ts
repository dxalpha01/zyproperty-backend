
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, files: {
    images?: Express.Multer.File[],
    videos?: Express.Multer.File[],
    floorPlan?: Express.Multer.File
  }): Promise<Property> {
    try {
      console.log('Received DTO:', createPropertyDto);
      console.log('Received files:', {
        imageCount: files.images?.length || 0,
        videoCount: files.videos?.length || 0,
        hasFloorPlan: !!files.floorPlan
      });

      const uploadDir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const imageUrls: string[] = [];
      const videoUrls: string[] = [];
      let floorPlanUrl: string | null = null;

      // Handle images
      if (files.images) {
        for (const image of files.images) {
          const fileName = `${Date.now()}-${image.originalname}`;
          await fs.writeFile(path.join(uploadDir, fileName), image.buffer);
          imageUrls.push(`/uploads/${fileName}`);
        }
      }

      // Handle videos
      if (files.videos) {
        for (const video of files.videos) {
          const fileName = `${Date.now()}-${video.originalname}`;
          await fs.writeFile(path.join(uploadDir, fileName), video.buffer);
          videoUrls.push(`/uploads/${fileName}`);
        }
      }

      // Handle floor plan
      if (files.floorPlan) {
        const fileName = `${Date.now()}-${files.floorPlan.originalname}`;
        await fs.writeFile(path.join(uploadDir, fileName), files.floorPlan.buffer);
        floorPlanUrl = `/uploads/${fileName}`;
      }

      // Parse features if it's a string
      let features = createPropertyDto.features;
      if (typeof features === 'string') {
        features = JSON.parse(features);
      }

      const property = this.propertyRepository.create({
        ...createPropertyDto,
        features,
        images: imageUrls,
        videos: videoUrls,
        floorPlan: floorPlanUrl,
      });

      console.log('Saving property:', property);
      const savedProperty = await this.propertyRepository.save(property);
      console.log('Saved property:', savedProperty);

      return savedProperty;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  }

  async findAll(): Promise<Property[]> {
    return await this.propertyRepository.find();
  }

  async findOne(id: string): Promise<Property> {
    return await this.propertyRepository.findOne({ where: { id } });
  }
}
