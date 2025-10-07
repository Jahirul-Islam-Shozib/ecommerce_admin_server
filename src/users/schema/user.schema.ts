import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'Users' })
export class Users {
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

  @Prop()
  password?: string;
}

export type UserDocument = Users & Document;
export const UserSchema = SchemaFactory.createForClass(Users);
