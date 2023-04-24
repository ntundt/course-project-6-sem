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
	public lastMessage?: LastMessageDto;
	public unreadMessagesCount?: number;
}