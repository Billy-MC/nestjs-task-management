import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ETaskStatus } from '../interface/tasks.interface';

export class GetTasksFilterDto {
	@IsOptional()
	@IsEnum(ETaskStatus)
	status?: ETaskStatus;

	@IsOptional()
	@IsString()
	search?: string;
}
