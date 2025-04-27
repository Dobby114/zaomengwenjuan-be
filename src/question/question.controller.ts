import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './schemas/question.schema';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
    @Query('isPublished') isPublished: boolean,
    @Query('isDeleted') isDeleted: boolean,
    @Query('isStar') isStar: boolean,
    @Request() req,
  ) {
    const userId = (req?.user?._id as string) || '';
    const list = await this.questionService.findQuestionList({
      keyword,
      pageNo,
      pageSize,
      userId,
      isPublished,
      isDeleted,
      isStar,
    });
    const allCount = await this.questionService.countAll({
      keyword,
      userId,
      isPublished,
      isDeleted,
      isStar,
    });

    return { list, count: allCount };
  }
  @Post()
  cerate(@Body() question: Question, @Request() req) {
    const userId = (req?.user?._id as string) || '';
    return this.questionService.create(userId, question);
  }
  @Get(':id')
  findOne(@Param() params: { id: string }) {
    return this.questionService.findOne(params?.id);
  }
  @Delete(':id')
  deleteOne(@Param() params: { id: string }, @Request() req) {
    const userId = (req?.user?._id as string) || '';
    return this.questionService.deleteOne(params.id, userId);
  }
  @Delete()
  deleteMany(@Body() body, @Request() req) {
    const userId = (req?.user?._id as string) || '';
    const { idList } = body;
    return this.questionService.deleteMany(idList, userId);
  }
}
