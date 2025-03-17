import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('fullName') fullName: string,
    @Body('avatar') avatar: string,
  ) {
    const result = await this.authService.register({
      username,
      password,
      fullName,
      avatar,
    });

    return {
      ...result,
      password: undefined,
    };
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt')) // Защита маршрута с помощью JWT-стратегии
  async getProfile(@Request() req) {
    const user = await this.authService.getUser(req.user.username);
    return {
      id: user.id,
      fullName: user.fullName,
      avatar: user.avatar,
      username: user.username,
    };
  }
}
