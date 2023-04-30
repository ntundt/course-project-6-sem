import { HttpError } from 'routing-controllers';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Chat } from '../../Chats/Chat';
import { User } from '../../User/User';
import { EntityManager } from 'typeorm';

export class AddChatMemberCommand {
	public adderId: number;
	public chatId: number;
	public userId: number;
}

export class AddChatMemberCommandHandler extends CommandHandlerBase<AddChatMemberCommand, void> {
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async handle(command: AddChatMemberCommand): Promise<void> {
		const chat = await this._em.getRepository(Chat).findOne({
			where: {
				id: command.chatId,
			},
			relations: ['members']
		});

		if (!chat) {
			throw new HttpError(404, 'Chat not found');
		}

		if (chat.creatorId !== command.adderId) {
			throw new HttpError(403, 'Only creator can add members to chat');
		}

		const user = await this._em.findOneBy(User, {
			id: command.userId
		});

		if (!user) {
			throw new HttpError(404, 'User not found');
		}

		if (chat.members.indexOf(user) !== -1) {
			throw new HttpError(409, 'User is already a member of this chat');
		}

		chat.members.push(user);

		await this._em.save(chat);
	}
}