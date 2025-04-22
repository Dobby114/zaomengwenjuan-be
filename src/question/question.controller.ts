import { Controller, Get,HttpException,HttpStatus } from '@nestjs/common';

@Controller('question')
export class QuestionController {
    @Get()
    getTest(){
        return "测试一下question get 路由"
    }
    @Get('tuesday')
    getTuesday(){
        return '今天是周二'
    }
    @Get('testError')
    testError(){
        throw new HttpException('获取数据失败',HttpStatus.BAD_REQUEST)
    }
}
