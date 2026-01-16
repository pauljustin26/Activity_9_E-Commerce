import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { CartController } from './cart.controller'; // <--- 1. Import This
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ProductsModule, 
  ],
  controllers: [CartController], // <--- 2. Add This Line!
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}