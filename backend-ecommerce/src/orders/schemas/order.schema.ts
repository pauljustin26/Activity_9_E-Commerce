import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop()
  customerName: string;

  @Prop()
  totalPrice: number;

  @Prop({ type: Array }) // Simplified for this mini-project
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);