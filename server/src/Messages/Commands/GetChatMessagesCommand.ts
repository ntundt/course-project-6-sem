import { EntityManager, Repository } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Message } from '../Message';
import ChatNotFoundError from '../../Chats/Errors/ChatNotFoundError';
import MessagesService from '../MessagesService';
import MessageDto from '../MessageDto';

export class GetChatMessagesCommand {
	public userId: number;
	public chatId: number;
	public offset: number;
	public count: number;
}

export class GetChatMessagesCommandHandler extends CommandHandlerBase<GetChatMessagesCommand, MessageDto[]> {
	private messageRepository: Repository<Message>;

	public constructor(entityManager: EntityManager) {
		super(entityManager);

		this.messageRepository = entityManager.getRepository(Message);
	}

	public async handle(command: GetChatMessagesCommand): Promise<MessageDto[]> {
		const isChatMember = await new MessagesService(this._em).userIsChatMember(command.userId, command.chatId);
		if (!isChatMember) {
			throw new ChatNotFoundError(command.chatId);
		}

		const messages = await this.messageRepository.find({
			where: { destinationChatId: command.chatId },
			order: { createdAt: 'DESC' },
			relations: ['attachments'],
			skip: command.offset,
			take: command.count,
		});

		return messages.map(message => new MessageDto(message));
	}
}
