import { EntityManager, Repository } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Message } from '../Message';

export class GetDialogsCommand {
	public userId: number;
}

export class GetDialogsCommandHandler extends CommandHandlerBase<GetDialogsCommand, Message[]> {
	private messageRepository: Repository<Message>;
	
	public constructor(entityManager: EntityManager) {
		super(entityManager);

		this.messageRepository = entityManager.getRepository(Message);
	}

	public async handle(command: GetDialogsCommand): Promise<Message[]> {
		let messages = await this.messageRepository.find({
			where: { senderId: command.userId },
			order: { createdAt: 'DESC' },
		});

		return messages;
	}
}
