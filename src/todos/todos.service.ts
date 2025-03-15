import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async create(title: string, userId: number): Promise<Todo> {
    const todo = this.todosRepository.create({
      title,
      user: { id: userId } as User,
    });
    return this.todosRepository.save(todo);
  }

  async findAllByUser(userId: number): Promise<Todo[]> {
    return this.todosRepository.find({
      where: { user: { id: userId } },
    });
  }

  async toggleComplete(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOneBy({ id });
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.completed = !todo.completed;
    return this.todosRepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    await this.todosRepository.delete(id);
  }
}
