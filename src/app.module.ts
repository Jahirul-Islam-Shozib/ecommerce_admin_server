import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    UserModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://jahirulislamshozib0_db_user:i5Kc4we2CrLTAYIO@cluster0.saoc7bo.mongodb.net/sq_ecom_DB?retryWrites=true&w=majority&appName=Cluster0',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
