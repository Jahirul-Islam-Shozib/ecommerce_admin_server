import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserSchema } from './schema/user.schema';
import { UsersController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        collection: 'Users',
        name: 'Users',
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
