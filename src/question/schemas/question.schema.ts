import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  desc: string;

  @Prop()
  css: string;

  @Prop()
  js: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isStar: boolean;

  @Prop()
  answerCount: number;

  @Prop()
  createTime: string;

  @Prop()
  componentList: {
    fe_id: string;
    type: string;
    title: string;
    isHidden: boolean;
    isLocked: boolean;
    props: object;
  }[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
