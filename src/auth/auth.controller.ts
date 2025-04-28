import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from 'src/user/dto/create-user.dto';
// import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body('data') userInfo: createUserDto) {
    const { username, password } = userInfo;
    return await this.authService.login(username, password);
  }

  @Get('profile')
  async getUserInfo(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await req.user;
  }
}
