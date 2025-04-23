
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop({required:true})
  _id: string;

  @Prop()
  title: string;

}

export const QuestionSchema = SchemaFactory.createForClass(Question);
