import { ETaskStatus } from './../interface/tasks.interface';
import { IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
	@IsEnum(ETaskStatus)
	status: ETaskStatus;
}
