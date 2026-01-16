import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module'; // <--- 1. Import This

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/mini-ecommerce'), 
    AuthModule,
    UsersModule, // <--- 2. Add This Line!
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}