import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity';

@Entity('ToDoItem')
export class TodoItem {
	@PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
	id: number;

	@Column({ type: 'bigint', name: 'todoId' })
	todoId: number;

	@Column({ type: 'nvarchar', length: 255, name: 'name' })
	name: string;

	@Column({ type: 'bit', name: 'isCompleted', default: false })
	isCompleted: boolean;

	@ManyToOne(() => Todo, (todo) => todo.items)
	@JoinColumn({ name: 'todoId', referencedColumnName: 'id' })
	todo?: Todo;
}
