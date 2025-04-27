/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuestionService {
  // 依赖注入，注入数据库schema
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}
  async create(userId: string, questionInfo: Question) {
    const question = new this.questionModel({ userId, ...questionInfo });
    return question.save();
  }
  // 查询问卷列表  分页  模糊搜索
  async findQuestionList({
    keyword = '',
    pageNo = 1,
    pageSize = 10,
    userId = '',
    isPublished,
    isDeleted = false, //默认获取未删除的问卷？
    isStar, //isStar
  }) {
    const whereOpt: any = {
      userId,
      isDeleted,
    };
    if (isPublished) {
      whereOpt.isPublished = isPublished as boolean;
    }
    if (isStar) {
      whereOpt.isStar = isStar as boolean;
    }
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
  async countAll({
    keyword = '',
    userId = '',
    isPublished,
    isDeleted = false, //默认获取未删除的问卷？
    isStar,
  }) {
    const whereOpt: any = {
      userId,
      isDeleted,
    };
    if (isPublished) {
      whereOpt.isPublished = isPublished as boolean;
    }
    if (isStar) {
      whereOpt.isStar = isStar as boolean;
    }
    if (keyword) {
      const reg = new RegExp(keyword, 'i');

      whereOpt.title = { $regex: reg };
    }
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg };
    }
    return this.questionModel.countDocuments(whereOpt);
  }
  //获取单个问卷
  async findOne(id: string) {
    return await this.questionModel.findById(id);
  }
  // 删除单个问卷
  async deleteOne(id: string, userId: string) {
    return await this.questionModel.findOneAndDelete({ _id: id, userId });
  }
  //删除多个问卷
  async deleteMany(idList: Array<string>, userId: string) {
    return await this.questionModel.deleteMany({
      _id: { $in: idList },
      userId,
    });
  }
}
