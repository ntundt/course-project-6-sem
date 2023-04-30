import AttachmentDto from '../Attachments/AttachmentDto';
import { Message } from './Message';

export default class MessageDto {
	public id: number;
	public senderId: number;
	public chatId: number;
	public text: string;
	public attachments: AttachmentDto[];
	public date: Date;
	public read: boolean;

	constructor(message: Message) {
		this.id = message.id;
		this.senderId = message.senderId;
		this.chatId = message.destinationChatId;
		this.text = message.text;
		this.attachments = message.attachments?.map(attachment => new AttachmentDto(attachment));
		this.date = message.createdAt;
		this.read = message.read;
	}
}
