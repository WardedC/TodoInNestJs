import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoItemDto {
	@ApiProperty({
		description: 'Título del item',
		example: 'Configurar base de datos'
	})
	title: string;

	@ApiProperty({
		description: 'Descripción opcional del item',
		example: 'Conectar con Supabase y configurar las entidades',
		required: false
	})
	description?: string;

	@ApiProperty({
		description: 'ID del todo al que pertenece este item',
		example: 1,
		required: false
	})
	todoId?: number;
}
