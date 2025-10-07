import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ProductsModule,
    UserModule,
    MongooseModule.forRoot(
      'mongodb+srv://jahirulislamshozib0_db_user:i5Kc4we2CrLTAYIO@cluster0.saoc7bo.mongodb.net/sq_ecom_DB?retryWrites=true&w=majority&appName=Cluster0\n',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
