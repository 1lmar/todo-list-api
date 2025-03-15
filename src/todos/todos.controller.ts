import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('todos')
@UseGuards(AuthGuard('jwt')) // Защита всех маршрутов токеном
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  async create(@Body('title') title: string, @Request() req) {
    const userId = req.user.userId; // Получаем ID пользователя из JWT
    return this.todosService.create(title, userId);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.userId; // Получаем ID пользователя из JWT
    return this.todosService.findAllByUser(userId);
  }

  @Patch(':id/toggle')
  async toggleComplete(@Param('id') id: number) {
    return this.todosService.toggleComplete(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.todosService.remove(id);
  }
}
