import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Schema as MongooseSchema, Types } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

@Schema()
export class User {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  identityNumber: string;

  @Prop({ required: true })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(uniqueValidator, {
  message: 'User with {PATH} already exists!',
});

UserSchema.pre('save', async function (next, opts) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.get('password'), 12);
    this.set('password', hashedPassword);
    return next();
  } catch (e) {
    return next(e);
  }
});
