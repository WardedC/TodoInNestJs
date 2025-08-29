import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TodoItemService } from './todo-item.service';
import { TodoItem } from './entities/todo-item.entity';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';

describe('TodoItemService', () => {
  let service: TodoItemService;
  let repository: Repository<TodoItem>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoItemService,
        {
          provide: getRepositoryToken(TodoItem),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodoItemService>(TodoItemService);
    repository = module.get<Repository<TodoItem>>(getRepositoryToken(TodoItem));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo item successfully', async () => {
      const createTodoItemDto: CreateTodoItemDto = {
        name: 'Test Item',
        isCompleted: false,
        todoId: 1,
      };

      const mockTodoItem = {
        id: 1,
        name: 'Test Item',
        isCompleted: false,
        todoId: 1,
      };

      mockRepository.create.mockReturnValue(mockTodoItem);
      mockRepository.save.mockResolvedValue(mockTodoItem);

      const result = await service.create(createTodoItemDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        name: createTodoItemDto.name,
        isCompleted: createTodoItemDto.isCompleted,
        todoId: createTodoItemDto.todoId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockTodoItem);
      expect(result).toEqual(mockTodoItem);
    });

    it('should create todo item with default isCompleted as false', async () => {
      const createTodoItemDto: CreateTodoItemDto = {
        name: 'Test Item',
        todoId: 1,
      };

      const mockTodoItem = {
        id: 1,
        name: 'Test Item',
        isCompleted: false,
        todoId: 1,
      };

      mockRepository.create.mockReturnValue(mockTodoItem);
      mockRepository.save.mockResolvedValue(mockTodoItem);

      const result = await service.create(createTodoItemDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        name: createTodoItemDto.name,
        isCompleted: false,
        todoId: createTodoItemDto.todoId,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of todo items with todo relation', async () => {
      const mockTodoItems = [
        {
          id: 1,
          name: 'Item 1',
          isCompleted: false,
          todoId: 1,
          todo: { id: 1, title: 'Todo 1' },
        },
        {
          id: 2,
          name: 'Item 2',
          isCompleted: true,
          todoId: 1,
          todo: { id: 1, title: 'Todo 1' },
        },
      ];

      mockRepository.find.mockResolvedValue(mockTodoItems);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({ relations: ['todo'] });
      expect(result).toEqual(mockTodoItems);
    });
  });

  describe('findOne', () => {
    it('should return a todo item by id', async () => {
      const mockTodoItem = {
        id: 1,
        name: 'Test Item',
        isCompleted: false,
        todoId: 1,
        todo: { id: 1, title: 'Todo 1' },
      };

      mockRepository.findOne.mockResolvedValue(mockTodoItem);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['todo'],
      });
      expect(result).toEqual(mockTodoItem);
    });

    it('should throw NotFoundException when todo item not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow('TodoItem not found');
    });
  });

  describe('update', () => {
    it('should update a todo item successfully', async () => {
      const updateTodoItemDto: UpdateTodoItemDto = {
        name: 'Updated Item',
        isCompleted: true,
      };

      const existingTodoItem = {
        id: 1,
        name: 'Original Item',
        isCompleted: false,
        todoId: 1,
        todo: { id: 1, title: 'Todo 1' },
      };

      const updatedTodoItem = {
        id: 1,
        name: 'Updated Item',
        isCompleted: true,
        todoId: 1,
        todo: { id: 1, title: 'Todo 1' },
      };

      mockRepository.findOne.mockResolvedValue(existingTodoItem);
      mockRepository.save.mockResolvedValue(updatedTodoItem);

      const result = await service.update(1, updateTodoItemDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['todo'],
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedTodoItem);
    });

    it('should throw NotFoundException when trying to update non-existent todo item', async () => {
      const updateTodoItemDto: UpdateTodoItemDto = {
        name: 'Updated Item',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateTodoItemDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a todo item successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when trying to remove non-existent todo item', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      await expect(service.remove(1)).rejects.toThrow('TodoItem not found');
    });
  });
});
