import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Product } from '../products/schemas/product.schema'; // Ensure this path is correct

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // ... existing register/create methods ...

  async updateCart(userId: string, cartItems: any[]) {
    // Overwrite the user's cart with the new frontend state
    return this.userModel.findByIdAndUpdate(userId, { cart: cartItems }, { new: true });
  }

  async getCart(userId: string) {
    const user = await this.userModel.findById(userId).populate('cart.productId').exec();
    
    if (!user || !user.cart) return [];

    // Filter out items where productId is null (e.g. product was deleted)
    return user.cart
      .filter((item: any) => item.productId) // <--- SAFETY CHECK
      .map((item: any) => ({
        ...item.productId.toObject(), 
        quantity: item.quantity,
        _id: item.productId._id 
      }));
  }
}