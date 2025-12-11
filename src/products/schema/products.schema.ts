import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductsDocument = Products & Document;

@Schema({ collection: 'Products' })
export class Products {
  @Prop()
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop()
  company: string;

  @Prop()
  image: string;

  @Prop()
  originalPrice: number;

  @Prop()
  discountedPrice: number;

  @Prop()
  weightValue: number;

  @Prop()
  weightUnit: string;

  @Prop()
  category: string;

  @Prop()
  inventoryStatus: string;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
