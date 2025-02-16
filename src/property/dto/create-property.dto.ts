
import { IsString, IsNumber, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePropertyDto {
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;
  @ApiProperty()
  @IsString()
  location: string;
  @ApiProperty()
  @IsString()
  type: string;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  bedrooms: number;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  bathrooms: number;
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  images: string[];
}