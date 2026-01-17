import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; // Needed for number conversion if you use it

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Type(() => Number)
  stock: number;

  @IsOptional()
  @IsString()
  description?: string;

  // 👇 ADD THIS
  @IsOptional()
  @IsString()
  imageUrl?: string;
}