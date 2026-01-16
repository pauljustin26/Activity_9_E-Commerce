import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../products/schemas/product.schema'; // Ensure path is correct

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // 👇 THIS PART IS CRITICAL 👇
  @Prop({ 
    type: [{ 
      productId: { type: Types.ObjectId, ref: 'Product' }, 
      quantity: Number 
    }], 
    default: [] 
  })
  cart: { productId: Types.ObjectId; quantity: number }[];
}

export const UserSchema = SchemaFactory.createForClass(User);