import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemController } from './todo-item.controller';
import { TodoItemService } from './todo-item.service';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { NotFoundException } from '@nestjs/common';

describe('TodoItemController', () => {
  let controller: TodoItemController;
  let service: TodoItemService;

  const mockTodoItemService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemController],
      providers: [
        {
          provide: TodoItemService,
          useValue: mockTodoItemService,
        },
      ],
    }).compile();

    controller = module.get<TodoItemController>(TodoItemController);
    service = module.get<TodoItemService>(TodoItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo item', async () => {
      const createTodoItemDto: CreateTodoItemDto = {
        name: 'Test Item',
        isCompleted: false,
        todoId: 1,
      };

      const expectedResult = {
        id: 1,
        name: 'Test Item',
        isCompleted: false,
        todoId: 1,
      };

      mockTodoItemService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createTodoItemDto);

      expect(service.create).toHaveBeenCalledWith(createTodoItemDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of todo items', async () => {
      const expectedResult = [
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

      mockTodoItemService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a todo item by id', async () => {
      const itemId = '1';
      const expectedResult = {
        id: 1,
        name: 'Test Item',
        isCompleted: false,
        todoId: 1,
        todo: { id: 1, title: 'Todo 1' },
      };

      mockTodoItemService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(itemId);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException when todo item not found', async () => {
      const itemId = '999';

      mockTodoItemService.findOne.mockRejectedValue(new NotFoundException('TodoItem not found'));

      await expect(controller.findOne(itemId)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a todo item', async () => {
      const itemId = '1';
      const updateTodoItemDto: UpdateTodoItemDto = {
        name: 'Updated Item',
        isCompleted: true,
      };

      const expectedResult = {
        id: 1,
        name: 'Updated Item',
        isCompleted: true,
        todoId: 1,
        todo: { id: 1, title: 'Todo 1' },
      };

      mockTodoItemService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(itemId, updateTodoItemDto);

      expect(service.update).toHaveBeenCalledWith(1, updateTodoItemDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException when trying to update non-existent todo item', async () => {
      const itemId = '999';
      const updateTodoItemDto: UpdateTodoItemDto = {
        name: 'Updated Item',
      };

      mockTodoItemService.update.mockRejectedValue(new NotFoundException('TodoItem not found'));

      await expect(controller.update(itemId, updateTodoItemDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, updateTodoItemDto);
    });
  });

  describe('remove', () => {
    it('should remove a todo item', async () => {
      const itemId = '1';

      mockTodoItemService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(itemId);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when trying to remove non-existent todo item', async () => {
      const itemId = '999';

      mockTodoItemService.remove.mockRejectedValue(new NotFoundException('TodoItem not found'));

      await expect(controller.remove(itemId)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
});
