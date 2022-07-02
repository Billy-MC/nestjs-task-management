import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
	@ApiProperty({
		description: 'The title of a task',
		type: String,
	})
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		description: 'The description of a task',
		type: String,
	})
	@IsNotEmpty()
	description: string;
}
