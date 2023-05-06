import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne, JoinColumn, ManyToMany, OneToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinTable } from 'typeorm';
import { User } from '../User/User';
import { Message } from '../Messages/Message';

@Entity()
export class Chat {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	creatorId: number;

	@ManyToOne('User', 'id')
	@JoinColumn()
	creator: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column()
	name: string;

	@Column({ nullable: true })
	avatar: string;

	/**
	 * If the group chat is private, then there are only two members, and no one else can join.
	 */
	@Column()
	isPrivate: boolean;

	/**
	 * The members of the group chat.
	 * For now, supports only users. In the future, I may want to support bots.
	 */
	@ManyToMany('User', 'groupChats', { cascade: true })
	@JoinTable()
	members: User[];

	@OneToMany('Message', 'destinationChatId')
	messages: Message[];

	/**
	 * Calculated: number of unread messages in the chat.
	 */

}
