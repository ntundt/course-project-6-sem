import { EntityManager, Repository } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Message } from '../Message';
import ChatNotFoundError from '../../Common/Errors/ChatNotFoundError';
import MessagesService from '../MessagesService';

export class GetChatMessagesCommand {
	public userId: number;
	public chatId: number;
	public offset: number;
	public count: number;
}

export class GetChatMessagesCommandHandler extends CommandHandlerBase<GetChatMessagesCommand, Message[]> {
	private messageRepository: Repository<Message>;

	public constructor(entityManager: EntityManager) {
		super(entityManager);

		this.messageRepository = entityManager.getRepository(Message);
	}

	public async handle(command: GetChatMessagesCommand): Promise<Message[]> {
		const isChatMember = await new MessagesService(this._em).userIsChatMember(command.userId, command.chatId);
		if (!isChatMember) {
			throw new ChatNotFoundError(command.chatId);
		}

		const messages = await this.messageRepository.find({
			where: { destinationChatId: command.chatId },
			order: { createdAt: 'DESC' },
			skip: command.offset,
			take: command.count,
		});

		return messages;
	}
}
