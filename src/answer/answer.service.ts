import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './schemas/answer.schema';
import { Model } from 'mongoose';
import { Question } from 'src/question/schemas/question.schema';
import { answerType } from './dto/answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name) private readonly answerModel: Model<Question>,
  ) {}

  async create(answerData: answerType) {
    const { questionId, answerList } = answerData;
    const answer = new this.answerModel({ questionId, answerList });
    return await answer.save();
  }
}
