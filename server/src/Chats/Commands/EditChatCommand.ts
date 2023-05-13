import { HttpError } from 'routing-controllers';
import { ChatDto } from '../ChatDto';
import { Chat } from '../Chat';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { EntityManager } from 'typeorm';

export class EditChatCommand {
	public userId: number;
	public chatId: number;
	public name: string;
	public avatar: string;
}

export class EditChatCommandHandler extends CommandHandlerBase<EditChatCommand, ChatDto> {
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async handle(command: EditChatCommand): Promise<ChatDto> {
		const chat = await this._em.getRepository(Chat).findOne({
			where: {
				id: command.chatId,
				creatorId: command.userId
			}
		});

		if (!chat) {
			throw new HttpError(404, 'Chat not found');
		}

		if (chat.isPrivate) {
			throw new HttpError(403, 'Cannot edit private chat');
		}

		chat.name = command.name;
		chat.avatar = command.avatar;

		await this._em.save(chat);

		return new ChatDto(await this._em.getRepository(Chat).findOne({
			where: {
				id: command.chatId,
			},
			relations: ['members', 'creator'],
		}));
	}
}
