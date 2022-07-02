import {
	Injectable,
	NotFoundException,
	Logger,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ETaskStatus } from './interface/tasks.interface';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
	private logger = new Logger('TasksService', { timestamp: true });
	constructor(
		@InjectRepository(Task)
		private tasksRepository: Repository<Task>
	) {}

	async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
		const { title, description } = createTaskDto;
		const task = this.tasksRepository.create({
			title,
			description,
			status: ETaskStatus.OPEN,
			user,
		});
		await this.tasksRepository.save(task);
		return task;
	}

	async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
		const { status, search } = filterDto;
		const query = this.tasksRepository.createQueryBuilder('task');
		query.where({ user });

		if (status) {
			query.andWhere('task.status = :status', { status });
		}
		if (search) {
			query.andWhere(
				'(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
				{
					search: `%${search}%`,
				}
			);
		}
		try {
			const tasks = await query.getMany();
			return tasks;
		} catch (err) {
			this.logger.error(`Filed to get tasks fro user "${user.username}".`, err.stack);
			throw new InternalServerErrorException();
		}
	}

	async getTaskById(id: string, user: User): Promise<Task> {
		const foundTask = await this.tasksRepository.findOne({ where: { id, user } });

		if (!foundTask) {
			throw new NotFoundException(`Task with ID '${id}' not found`);
		}
		return foundTask;
	}

	async updateTaskById(id: string, status: ETaskStatus, user: User): Promise<Task> {
		const task = await this.getTaskById(id, user);
		task.status = status;
		await this.tasksRepository.save(task);
		return task;
	}

	async deleteTaskById(id: string, user: User): Promise<void> {
		const result = await this.tasksRepository.delete({ id, user });
		if (result.affected === 0) {
			throw new NotFoundException(`Task with ID '${id}' not found`);
		}
	}
}
