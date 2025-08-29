import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { NotFoundException } from '@nestjs/common';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  const mockTodoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllWithItems: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const expectedResult = {
        status: 'success',
        data: { id: 1, ...createTodoDto },
      };

      mockTodoService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createTodoDto);

      expect(service.create).toHaveBeenCalledWith(createTodoDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const expectedResult = [
        { id: 1, title: 'Todo 1', description: 'Description 1' },
        { id: 2, title: 'Todo 2', description: 'Description 2' },
      ];

      mockTodoService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAllWithItems', () => {
    it('should return todos with their items', async () => {
      const expectedResult = [
        {
          id: 1,
          title: 'Todo 1',
          description: 'Description 1',
          items: [{ id: 1, title: 'Item 1' }],
        },
      ];

      mockTodoService.findAllWithItems.mockResolvedValue(expectedResult);

      const result = await controller.findAllWithItems();

      expect(service.findAllWithItems).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const todoId = '1';
      const expectedResult = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        items: [],
      };

      mockTodoService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(todoId);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException when todo not found', async () => {
      const todoId = '999';

      mockTodoService.findOne.mockRejectedValue(new NotFoundException('Todo not found'));

      await expect(controller.findOne(todoId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const todoId = '1';
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
        description: 'Updated Description',
      };

      const expectedResult = {
        id: 1,
        title: 'Updated Todo',
        description: 'Updated Description',
        items: [],
      };

      mockTodoService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(todoId, updateTodoDto);

      expect(service.update).toHaveBeenCalledWith(1, updateTodoDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException when trying to update non-existent todo', async () => {
      const todoId = '999';
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
      };

      mockTodoService.update.mockRejectedValue(new NotFoundException('Todo not found'));

      await expect(controller.update(todoId, updateTodoDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, updateTodoDto);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const todoId = '1';

      mockTodoService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(todoId);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when trying to remove non-existent todo', async () => {
      const todoId = '999';

      mockTodoService.remove.mockRejectedValue(new NotFoundException('Todo not found'));

      await expect(controller.remove(todoId)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
});
