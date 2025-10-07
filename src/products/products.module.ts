import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsSchema } from './schema/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Products', schema: ProductsSchema, collection: 'Products' },
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
