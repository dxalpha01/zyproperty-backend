
import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('properties')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
    { name: 'floorPlan', maxCount: 1 },
  ]))
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles() files: {
      images?: Express.Multer.File[],
      videos?: Express.Multer.File[],
      floorPlan?: Express.Multer.File[]
    }
  ) {
    return this.propertyService.create(createPropertyDto, {
      images: files.images,
      videos: files.videos,
      floorPlan: files.floorPlan?.[0],
    });
  }

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }
}
