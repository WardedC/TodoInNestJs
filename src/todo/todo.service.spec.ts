import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { TodoItem } from '../todo-item/entities/todo-item.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoService', () => {
  let service: TodoService;
  let todoRepository: Repository<Todo>;
  let todoItemRepository: Repository<TodoItem>;

  const mockTodoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockTodoItemRepository = {
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
        {
          provide: getRepositoryToken(TodoItem),
          useValue: mockTodoItemRepository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
    todoItemRepository = module.get<Repository<TodoItem>>(getRepositoryToken(TodoItem));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo successfully', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const mockTodo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
      };

      mockTodoRepository.create.mockReturnValue(mockTodo);
      mockTodoRepository.save.mockResolvedValue(mockTodo);

      const result = await service.create(createTodoDto);

      expect(mockTodoRepository.create).toHaveBeenCalledWith(createTodoDto);
      expect(mockTodoRepository.save).toHaveBeenCalledWith(mockTodo);
      expect(result).toEqual({
        status: 'success',
        data: mockTodo,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const mockTodos = [
        {  title: 'Todo 1', description: 'Description 1' },
        {  title: 'Todo 2', description: 'Description 2' },
      ];

      mockTodoRepository.find.mockResolvedValue(mockTodos);

      const result = await service.findAll();

      expect(mockTodoRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockTodos);
    });
  });

  describe('findAllWithItems', () => {
    it('should return todos with their items', async () => {
      const mockTodosWithItems = [
        {
          id: 1,
          title: 'Todo 1',
          description: 'Description 1',
          items: [{ id: 1, title: 'Item 1' }],
        },
      ];

      mockTodoRepository.find.mockResolvedValue(mockTodosWithItems);

      const result = await service.findAllWithItems();

      expect(mockTodoRepository.find).toHaveBeenCalledWith({ relations: ['items'] });
      expect(result).toEqual(mockTodosWithItems);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const mockTodo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        items: [],
      };

      mockTodoRepository.findOne.mockResolvedValue(mockTodo);

      const result = await service.findOne(1);

      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['items'],
      });
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException when todo not found', async () => {
      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow('Todo not found');
    });
  });

  describe('update', () => {
    it('should update a todo successfully', async () => {
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
        description: 'Updated Description',
      };

      const existingTodo = {
        id: 1,
        title: 'Original Todo',
        description: 'Original Description',
        items: [],
      };

      const updatedTodo = {
        id: 1,
        title: 'Updated Todo',
        description: 'Updated Description',
        items: [],
      };

      mockTodoRepository.findOne.mockResolvedValue(existingTodo);
      mockTodoRepository.save.mockResolvedValue(updatedTodo);

      const result = await service.update(1, updateTodoDto);

      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['items'],
      });
      expect(mockTodoRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedTodo);
    });

    it('should throw NotFoundException when trying to update non-existent todo', async () => {
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
      };

      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateTodoDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a todo and its items successfully', async () => {
      const mockTodo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
      };

      mockTodoRepository.findOne.mockResolvedValue(mockTodo);
      mockTodoItemRepository.delete.mockResolvedValue({ affected: 2 });
      mockTodoRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockTodoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockTodoItemRepository.delete).toHaveBeenCalledWith({ todoId: 1 });
      expect(mockTodoRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when trying to remove non-existent todo', async () => {
      mockTodoRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      await expect(service.remove(1)).rejects.toThrow('Todo not found');

      expect(mockTodoItemRepository.delete).not.toHaveBeenCalled();
      expect(mockTodoRepository.delete).not.toHaveBeenCalled();
    });
  });
});
