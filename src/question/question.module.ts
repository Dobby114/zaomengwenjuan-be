import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Question,QuestionSchema } from './schemas/question.schema';
import {Test,TestSchema} from './schemas/test.schema'
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{name:Question.name,schema:QuestionSchema},{name:Test.name,schema:TestSchema}])],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
