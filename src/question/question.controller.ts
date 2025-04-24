import { Controller, Get, Post, Query } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
  ) {
    const list = await this.questionService.findQuestionList({
      keyword,
      pageNo,
      pageSize,
    });
    const allCount = await this.questionService.countAll({ keyword });

    return { list, count: allCount };
  }
  // @Get('tuesday')
  // getTuesday(){
  //     return '今天是周二'
  // }
  // @Get('testError')
  // testError(){
  //     throw new HttpException('获取数据失败',HttpStatus.BAD_REQUEST)
  // }
  @Post()
  cerateTest() {
    return this.questionService.create();
  }
}
