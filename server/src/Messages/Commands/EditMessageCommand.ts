import { EntityManager } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Message } from '../Message';
import ChatNotFoundError from '../../Chats/Errors/ChatNotFoundError';
import MessagesService from '../MessagesService';
import { HttpError } from 'routing-controllers';
import { Attachment } from '../../Attachments/Attachment';

export class EditMessageCommand {
	public editorId: number;
	public chatId: number;
	public messageId: number;
	public text: string;
	public attachmentIds: string[];
}

export class EditMessageCommandHandler extends CommandHandlerBase<EditMessageCommand, Message> {
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}


	public async handle(command: EditMessageCommand): Promise<Message> {
		const isChatMember = new MessagesService(this._em).userIsChatMember(command.editorId, command.chatId);
		if (!isChatMember) {
			throw new ChatNotFoundError(command.chatId);
		}

		const message = await this._em.findOneBy(Message, {
			id: command.messageId,
			destinationChatId: command.chatId,
		});

		if (!message) {
			throw new HttpError(404, 'Message not found');
		}

		message.text = command.text ?? message.text;
		message.attachments = command.attachmentIds?.map(id => {
			const attachment = new Attachment();
			attachment.id = id;
			return attachment;
		});

		return await this._em.save(message);
	}
}
