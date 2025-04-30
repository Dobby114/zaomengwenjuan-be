import { Controller, Post, Body } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { answerType } from './dto/answer.dto';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Public()
  @Post()
  create(
    @Body()
    bodyData: answerType,
  ) {
    // console.log(bodyData);
    return this.answerService.create(bodyData);
  }
}
