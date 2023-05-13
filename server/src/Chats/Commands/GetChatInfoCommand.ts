import { EntityManager } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Chat } from '../Chat';
import { HttpError } from 'routing-controllers';

export class GetChatInfoCommand {
	public chatId: number;
}

export class GetChatInfoCommandResult {
	public chatId: number;
	public chatName: string;
	public chatAvatar: string;
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
			throw new HttpError(404, 'Chat not found');
		}

		let result = new GetChatInfoCommandResult;

		result.chatId = chat.id;
		result.chatName = chat.name;
		result.chatAvatar = chat.avatar;
		result.isPrivate = chat.isPrivate;

		return result;
	}
}


