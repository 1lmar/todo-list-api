import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

export interface IUserRegisterParams {
  fullName: string;
  avatar: string;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async register({
    username,
    password,
    fullName,
    avatar,
  }: IUserRegisterParams): Promise<User> {
    const user = new User();
    user.username = username;
    user.password = password;
    user.fullName = fullName;
    user.avatar = avatar;
    return this.usersRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }
}
