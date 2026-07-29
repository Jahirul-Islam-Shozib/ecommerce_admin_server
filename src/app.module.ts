import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/order.module';
import { NotificationModule } from './notifications/notification.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
    UserModule,
    OrdersModule,
    NotificationModule,
    AuthModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://172.16.234.38:5001/productDB',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
