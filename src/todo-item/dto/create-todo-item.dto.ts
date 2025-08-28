import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoItemDto {
	@ApiProperty({
		description: 'ID del todo al que pertenece este item',
		example: 1
	})
	todoId: number;

	@ApiProperty({
		description: 'Nombre del item',
		example: 'Configurar base de datos'
	})
	name: string;

	@ApiProperty({
		description: 'Si el item está completado o no',
		example: false,
		required: false
	})
	isCompleted?: boolean;
}
