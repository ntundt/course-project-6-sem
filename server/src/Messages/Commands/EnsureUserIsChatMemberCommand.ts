import { EntityManager, Repository } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Chat } from '../../Chats/Chat';

export class EnsureUserIsChatMemberCommand {
	public userId: number;
	public chatId: number;
}

export class EnsureUserIsChatMemberCommandHandler extends CommandHandlerBase<EnsureUserIsChatMemberCommand, boolean> {
	private chatRepository: Repository<Chat>;

	public constructor(entityManager: EntityManager) {
		super(entityManager);

		this.chatRepository = entityManager.getRepository(Chat);
	}

	public async handle(command: EnsureUserIsChatMemberCommand): Promise<boolean> {
		return this.chatRepository.exist({
			where: { id: command.chatId, members: [{ id: command.userId }]}
		});
	}
}
