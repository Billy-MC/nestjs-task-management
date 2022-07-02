import { NotFoundException } from '@nestjs/common';
import { ETaskStatus } from './interface/tasks.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

const mockFilter = {
	status: ETaskStatus.OPEN,
	search: '',
};

const mockUser = {
	username: 'Billy',
	id: 'someId',
	password: 'somePassword',
	tasks: [],
};

const mockTask = {
	title: 'Test title',
	description: 'Test Description',
	id: 'SomeId',
	status: ETaskStatus.OPEN,
};

const mockTasksRepository = () => ({
	getTasks: jest.fn(),
	findOne: jest.fn().mockReturnValue(mockTask),
	findOneBy: jest.fn().mockResolvedValue(null),
});

describe('TasksService', () => {
	let tasksService: TasksService;
	let tasksRepository: Repository<Task>;

	beforeEach(async () => {
		// initialize a NEstJS module with tasksService
		const moduleRef: TestingModule = await Test.createTestingModule({
			providers: [
				TasksService,
				{ provide: getRepositoryToken(Task), useFactory: mockTasksRepository },
			],
		}).compile();

		tasksService = moduleRef.get<TasksService>(TasksService);
		tasksRepository = moduleRef.get<Repository<Task>>(getRepositoryToken(Task));
	});

	it('should be defined', () => {
		expect(tasksService).toBeDefined();
	});

	describe('getTaskById', () => {
		it('call TasksRepository.findOne and returns the result', async () => {
			tasksRepository.findOne;
			const result = await tasksService.getTaskById('someId', mockUser);
			expect(result).toEqual(mockTask);
		});
	});
});
