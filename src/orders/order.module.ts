import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { Orders, OrdersSchema } from './schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        collection: 'Orders',
        name: Orders.name,
        schema: OrdersSchema,
      },
    ]),
  ],
  controllers: [OrdersController],
  exports: [OrdersService],
  providers: [OrdersService],
})
export class OrdersModule {}
