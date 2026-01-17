import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

// Configuration for saving files to disk
const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 1. GET ALL
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // 2. GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // 3. CREATE (With Image)
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage }))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createProductDto.imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    }
    return this.productsService.create({
      ...createProductDto,
      price: Number(createProductDto.price),
      stock: Number(createProductDto.stock),
    });
  }

  // 4. UPDATE (With Image)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', { storage }))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateProductDto.imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    }

    const dataToUpdate = {
        ...updateProductDto,
        price: Number(updateProductDto.price),
        stock: Number(updateProductDto.stock),
    };
    
    // If no new file, ensure we don't overwrite existing URL with undefined
    if (!file) {
       delete dataToUpdate.imageUrl; 
    }

    return this.productsService.update(id, dataToUpdate);
  }

  // 5. DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}