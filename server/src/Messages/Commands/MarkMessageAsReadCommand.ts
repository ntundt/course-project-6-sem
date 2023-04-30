import { EntityManager, Repository } from 'typeorm';
import { Message } from '../Message';
import { NotFoundError } from 'routing-controllers';
import MessagesService from '../MessagesService';
import CommandHandlerBase from '../../Common/CommandHandlerBase';

export class MarkMessageAsReadCommand {
	public chatId: number;
	public messageId: number;
	public userId: number;
}

export class MarkMessageAsReadCommandHandler extends CommandHandlerBase<MarkMessageAsReadCommand, void> {
	private readonly messageRepository: Repository<Message>;

	public constructor(entityManager: EntityManager) {
		super(entityManager);

		this.messageRepository = entityManager.getRepository(Message);
	}

	public async handle(command: MarkMessageAsReadCommand): Promise<void> {
		const userIsChatMember = await new MessagesService(this._em).userIsChatMember(command.userId, command.chatId);
		if (!userIsChatMember) {
			throw new NotFoundError('Chat not found');
		}

		const message = await this.messageRepository.findOneBy({ id: command.messageId, destinationChatId: command.chatId });

		if (!message) {
			throw new NotFoundError('Message not found');
		}

		// for now we don't care who read the message
		message.read = true;

		await this.messageRepository.save(message);
	}
}