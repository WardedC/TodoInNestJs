import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity';

@Entity('ToDoItem')
export class TodoItem {
	@PrimaryGeneratedColumn({ type: 'bigint', name: 'itemId' })
	itemId: string;

	@Column({ type: 'varchar', name: 'title' })
	title: string;

	@Column({ type: 'text', name: 'description', nullable: true })
	description?: string;

	@Column({ type: 'boolean', name: 'is_done', default: false })
	is_done: boolean;

	@Column({ type: 'date', name: 'date_created', nullable: true })
	date_created?: Date | null;

	@Column({ type: 'bigint', name: 'todoId', nullable: true })
	todoId?: string | null;

	@ManyToOne(() => Todo, (todo) => todo.items, { nullable: true })
	@JoinColumn({ name: 'todoId', referencedColumnName: 'id' })
	todo?: Todo | null;
}
