import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
	@ApiProperty({
		description: 'Título del todo',
		example: 'Completar proyecto de NestJS'
	})
	title: string;

	@ApiProperty({
		description: 'Descripción opcional del todo',
		example: 'Implementar todas las funcionalidades básicas del CRUD',
		required: false
	})
	description?: string;
}
