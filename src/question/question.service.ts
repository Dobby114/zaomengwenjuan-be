/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuestionService {
  // 依赖注入，注入数据库schema
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}
  async create() {
    const question = new this.questionModel({
      title: 'title' + Date.now(),
      desc: 'desc',
    });
    return question.save();
  }
  // 查询问卷列表  分页  模糊搜索
  async findQuestionList({ keyword = '', pageNo = 1, pageSize = 10 }) {
    const whereOpt: any = {};
    if (keyword) {
      const reg = new RegExp(keyword, 'i');

      whereOpt.title = { $regex: reg };
    }
    return this.questionModel
      .find(whereOpt)
      .sort({ _id: -1 })
      .skip((pageNo - 1) * 10)
      .limit(pageSize);
  }
  // count数据
  async countAll({ keyword = '' }) {
    const whereOpt: any = {};
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg };
    }
    return this.questionModel.countDocuments(whereOpt);
  }
}
