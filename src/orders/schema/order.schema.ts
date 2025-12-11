import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/** ---------- Sub Schemas ---------- */

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  weightValue: number;

  @Prop({ required: true })
  weightUnit: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  pricePerUnit: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  image: string;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class DeliveryOption {
  @Prop()
  pickupPoint: string;

  @Prop()
  deliveryDay: string;

  @Prop({ enum: ['Cash'], default: 'Cash' })
  paymentMethod: 'Cash';

  @Prop()
  deliveryNote: string;
}
export const DeliveryOptionSchema =
  SchemaFactory.createForClass(DeliveryOption);

@Schema({ _id: false })
export class OrderSummary {
  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ default: 0 })
  totalPrice: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  subtotal: number;
}
export const OrderSummarySchema = SchemaFactory.createForClass(OrderSummary);

/**
 * Snapshot of user info stored inside an order.
 * (Keeps order history stable even if user changes later.)
 */
@Schema({ _id: false })
export class EmployeeInfo {
  @Prop()
  employeeId: string;

  @Prop()
  name: string;

  @Prop()
  company: string;

  @Prop()
  designation: string;

  @Prop()
  department: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;
}
export const EmployeeInfoSchema = SchemaFactory.createForClass(EmployeeInfo);

/** ---------- Main Orders Schema ---------- */

@Schema({ collection: 'Orders' })
export class Orders {
  @Prop({ required: true, unique: true })
  orderId: string; // e.g. "ORD-1002"

  @Prop({ type: EmployeeInfoSchema, required: true })
  employeeInfo: EmployeeInfo;

  @Prop({ type: DeliveryOptionSchema, required: true })
  deliveryOption: DeliveryOption;

  @Prop({ type: OrderSummarySchema, required: true })
  orderSummary: OrderSummary;

  @Prop({
    type: String,
    enum: ['Pending', 'Confirmed', 'Delivered', 'Cancel'],
    default: 'Pending',
  })
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancel';

  @Prop({ required: true })
  createdAt: string;
}

export type OrdersDocument = Orders & Document;
export const OrdersSchema = SchemaFactory.createForClass(Orders);
