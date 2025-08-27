
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface BaseResponse<T> {
  status: string;
  data: T;
}

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly repo: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<BaseResponse<Todo>> {
    const todo = this.repo.create(createTodoDto);
    const saved = await this.repo.save(todo);
    return { status: 'success', data: saved };
  }

  findAll(): Promise<Todo[]> {
    return this.repo.find();
  }
  
  findAllWithItems(): Promise<Todo[]> {
    return this.repo.find({ relations: ['items'] });
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.repo.findOne({ where: { id } as any, relations: ['items'] });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return this.repo.save(todo);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id as any);
    if (!result.affected) throw new NotFoundException('Todo not found');
  }
}
