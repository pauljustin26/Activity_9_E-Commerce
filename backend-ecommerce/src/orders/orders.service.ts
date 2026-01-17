import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, customerName } = createOrderDto;
    let totalPrice = 0;

    // FIX: We explicitly type this array so TypeScript knows what it can hold
    const orderItems: { 
      productId: any; 
      productName: string; 
      quantity: number; 
      price: number 
    }[] = [];

    // 1. Process each item
    for (const item of items) {
      const product = await this.productModel.findById(item.productId);

      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for ${product.name}`);
      }

      // 2. Deduct Stock
      product.stock -= item.quantity;
      await product.save();

      // 3. Calculate Price
      totalPrice += product.price * item.quantity;
      
      orderItems.push({
        productId: product._id, // This is an ObjectId, which is why we used 'any' above to be safe
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 4. Create Order
    const order = new this.orderModel({
      customerName,
      items: orderItems,
      totalPrice,
    });

    return order.save();
  }

  // Add inside OrdersService class:
  async findAll() {
    return this.orderModel.find().sort({ createdAt: -1 }).exec(); // Newest first
  }

  async findUserOrders(customerName: string) {
    return this.orderModel.find({ customerName }).sort({ createdAt: -1 }).exec();
  }
}