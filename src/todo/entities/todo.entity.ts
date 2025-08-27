import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TodoItem } from '../../todo-item/entities/todo-item.entity';

@Entity('ToDo')
export class Todo {
	@PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
	id: string;

	@Column({ type: 'varchar', name: 'title' })
	title: string;

	@Column({ type: 'text', name: 'description', nullable: true })
	description?: string;

	@OneToMany(() => TodoItem, (item) => item.todo, { cascade: true })
	items?: TodoItem[];
}
