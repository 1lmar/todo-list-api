import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRegisterParams, UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(params: IUserRegisterParams) {
    const existingUser = await this.usersService.findOne(params.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    return this.usersService.register(params);
  }

  async getUser(username: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new Error('no user');
    }

    return user;
  }
}
