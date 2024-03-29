import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, ManyToOne,
	JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Check, Index }
from 'typeorm';

import { User } from '../User/User';
import { Attachment } from '../Attachments/Attachment';
import { Chat as Chat } from '../Chats/Chat';

@Entity()
//@Check(`(destinationUserId IS NOT NULL)::int + (destinationGroupChatId IS NOT NULL)::int = 1`)
export class Message /* implements PolymorphicChildInterface */ {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	senderId: number;

	@ManyToOne('User', 'id')
	@JoinColumn()
	sender: User;

	@Column({ nullable: true })
	destinationChatId: number;

	@ManyToOne('Chat', 'messages')
	destinationChat: Chat;

	@Column({ length: 4096 })
	text: string;

	@Column({ default: false })
	read: boolean;

	@OneToMany('Attachment', 'message')
	attachments: Attachment[];

	@Index()
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

}
