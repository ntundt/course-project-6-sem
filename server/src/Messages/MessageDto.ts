import AttachmentDto from '../Attachments/AttachmentDto';

export default class MessageDto {
	public id: number;
	public senderId: number;
	public chatId: number;
	public text: string;
	public attachments: AttachmentDto[];
	public date: Date;
}
