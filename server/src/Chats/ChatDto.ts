import MessageDto from '../Messages/MessageDto';
import { Chat } from './Chat';

export class LastMessageAttachmentDto {
	public id: string;
	public type: string;
	public url: string;
}

export class LastMessageDto {
	public id: number;
	public senderId: number;
	public text: string;
	public createdAt: Date;
	public attachments: LastMessageAttachmentDto[];
}

export class ChatDto {
	public id: number;
	public type: string;
	public name: string;
	public avatar: string;
	public createdAt: Date;
	public messages: MessageDto[];
	public membersCount?: number;
	public creatorId?: number;
	public unreadMessagesCount?: number;

	public constructor(chat: Chat) {
		this.id = chat.id;
		this.type = chat.isPrivate ? 'private' : 'group';
		this.name = chat.name;
		this.avatar = chat.avatar;
		this.createdAt = chat.createdAt;
		this.messages = chat.messages.map(message => new MessageDto(message));
		if (!chat.isPrivate) this.creatorId = chat.creatorId;
		this.membersCount = chat.members.length;
	}

}