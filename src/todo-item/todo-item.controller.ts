import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoItemService } from './todo-item.service';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';

@Controller('todo-item')
export class TodoItemController {
  constructor(private readonly todoItemService: TodoItemService) {}

  @Post()
  create(@Body() createTodoItemDto: CreateTodoItemDto) { return this.todoItemService.create(createTodoItemDto); }

  @Get()
  findAll() { return this.todoItemService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.todoItemService.findOne(id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoItemDto: UpdateTodoItemDto) { return this.todoItemService.update(id, updateTodoItemDto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.todoItemService.remove(id); }
}
