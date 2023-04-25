import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, OneToOne, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable, JoinColumn, OneToMany } from 'typeorm';
import { Chat } from '../Chats/Chat';
import * as crypto from 'crypto';
import { Report } from '../Reports/Report';

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ length: 32, unique: true, nullable: true })
	username: string;

	@Column({ nullable: true, length: 64 })
	profilePicUrl: string;

	@Column({ nullable: true, length: 64 })
	email: string;

	@Column({ default: false })
	emailVerified: boolean;

	@Column({ length: 64 })
	passwordHash: string;

	@Column({ length: 64 })
	salt: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column({ nullable: true })
	blockedTo: Date;

	@Column({ nullable: true })
	blockedReason: string;

	@Column({ nullable: true })
	blockedById: number;

	@ManyToOne(() => User, user => user.id)
	@JoinColumn()
	blockedBy: User;

	@Column({ nullable: true })
	isAdmin: boolean;

	/**
	 * The group chats that the user is a member of.
	 */
	@ManyToMany(() => Chat, groupChat => groupChat.members)
	groupChats: Chat[];

}

export function getPasswordHash(password: string, salt: string): string {
	return crypto.createHash('sha256').update(password + salt).digest('hex');
}

export function generateSalt(): string {
	return crypto.randomBytes(16).toString('hex');
}
