import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Generated, CreateDateColumn } from 'typeorm';
import { Message } from '../Messages/Message';
import AttachmentType from './AttachmentType.enum';
import * as config from '../config.json';
import { User } from '../User/User';

/**
 * Note that the path to the file in the file system is as follows:
 * 	
 *     config.upload_dir + '/' + attachment id + '.' + attachment extension
 * 
 * And the URL to the file is:
 * 
 *      config.upload_url + '/' + attachment id + '.' + attachment extension
 */
@Entity()
export class Attachment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: false, default: 1 })
	uploaderId: number;

	@ManyToOne(() => User, user => user.id)
	@JoinColumn()
	uploader: User;

	@Column({ nullable: true })
	messageId: number;

	@ManyToOne(() => Message, message => message.attachments)
	@JoinColumn()
	message: Message;

	@Column({ length: 255 })
	filename: string;

	@Column({ default: 1 })
	width: number;

	@Column({ default: 1 })
	height: number;

	@Column({ enum: AttachmentType, type: 'enum', default: AttachmentType.Document })
	type: AttachmentType;

	@CreateDateColumn()
	createdAt: Date;
}

export function getAttachmentUrl(attachment: Attachment) {
	return config.server.protocol + '://' + config.server.host + ':' + config.server.port + '/' 
		+ config.server.upload_url + attachment.id + '.' + attachment.filename.split('.').pop();
}

export function getAttachmentPath(attachment: Attachment) {
	return config.server.upload_dir + attachment.id + '.' + attachment.filename.split('.').pop();
}
