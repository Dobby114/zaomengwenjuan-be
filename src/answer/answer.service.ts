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
  // 统计某个问卷的所有答卷数量
  async countAll(questionId: string) {
    if (!questionId) return 0;
    return await this.answerModel.countDocuments({ questionId });
  }

  //   分页返回某个问卷所有的答卷
  async findAll(questionId: string, pageNo = 1, pageSize = 10) {
    if (!questionId) return [];
    const list = await this.answerModel
      .find({ questionId })
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
      .sort({ createTime: -1 });
    return list;
  }
}
