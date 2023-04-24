import { EntityManager } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Chat } from '../Chat';

export class GetChatInfoCommand {
	public chatId: number;
}

export class GetChatInfoCommandResult {
	public chatId: number;
	public chatName: string;
	public chatMembers: number[];
	public isPrivate: boolean;
}

export class GetChatInfoCommandHandler extends CommandHandlerBase<GetChatInfoCommand, GetChatInfoCommandResult> {
	private entityManager: EntityManager;

	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async handle(command: GetChatInfoCommand): Promise<GetChatInfoCommandResult> {
		let chat = await this._em.getRepository(Chat).findOneBy({
			id: command.chatId
		});

		if (!chat) {
			throw new Error('Chat not found');
		}

		let result = new GetChatInfoCommandResult;

		result.chatId = chat.id;
		result.chatName = chat.name;
		result.chatMembers = chat.members.map(member => member.id);
		result.isPrivate = chat.isPrivate;

		return result;
	}
}


