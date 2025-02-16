
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
@ApiTags('properties')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }
  @Get()
  findAll() {
    return this.propertyService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(+id);
  }
}