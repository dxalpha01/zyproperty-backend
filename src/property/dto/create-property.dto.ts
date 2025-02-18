
import { IsString, IsNumber, IsArray, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PropertyType {
  SALE = 'SALE',
  RENT = 'RENT',
}

export class CreatePropertyDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  type: PropertyType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  bedrooms: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  bathrooms: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  squareFootage: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  features: string[];
}
