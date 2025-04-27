import { Body, Controller, Post, Redirect, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Public()
  @Post('register')
  async create(@Body() userBto: createUserDto) {
    try {
      return await this.userService.create(userBto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  @Public()
  @Post('login')
  @Redirect('/api/auth/login', 307) //post临时重定向----307；永久重定向----308
  login() {
    return;
  }
  @Get('userInfo')
  @Redirect('/api/auth/profile', 302) //post临时重定向----302；永久重定向----301
  getUserInfo() {
    return;
  }
}
