import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../User/User';
import { Message } from '../Messages/Message';

@Entity()
export class Report {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@ManyToOne(() => User, user => user.reports)
	@JoinColumn()
	user: User;

	@Column()
	authorId: number;

	@ManyToOne(() => User, user => user.id)
	@JoinColumn()
	author: User;

	@Column({ length: 255 })
	reason: string;

	@Column({ default: false })
	isResolved: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ nullable: true })
	resolvedAt: Date;

	@Column({ nullable: true })
	messageId: number;

	@ManyToOne(() => Message, message => message.id)
	@JoinColumn()
	message: Message;

}