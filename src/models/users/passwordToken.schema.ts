import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type PasswordTokenDocument = PasswordToken & Document;

@Schema()
export class PasswordToken {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  created: Date;

  @Prop({ required: true })
  expire: Date;

  @Prop({ required: true, default: false })
  validated: boolean;
}

export const PasswordTokenSchema = SchemaFactory.createForClass(PasswordToken);
