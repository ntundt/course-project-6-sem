import { HttpError } from 'routing-controllers';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { User } from '../../User/User';
import { Chat } from '../../Chats/Chat';
import { EntityManager } from 'typeorm';

export class RemoveChatMemberCommand {
	public removerId: number;
	public chatId: number;
	public userId: number;
}

export class RemoveChatMemberCommandHandler extends CommandHandlerBase<RemoveChatMemberCommand, void> {
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async handle(command: RemoveChatMemberCommand): Promise<void> {
		const chat = await this._em.getRepository(Chat).findOne({
			where: {
				id: command.chatId,
			},
			relations: ['members']
		});

		if (!chat) {
			throw new HttpError(404, 'Chat not found');
		}

		if (chat.creatorId !== command.removerId) {
			throw new HttpError(403, 'Only creator can remove members from chat');
		}

		const user = await this._em.findOneBy(User, {
			id: command.userId
		});

		if (!user) {
			throw new HttpError(404, 'User not found');
		}

		if (chat.members.map(member => member.id).indexOf(user.id) === -1) {
			throw new HttpError(409, 'User is not a member of this chat');
		}

		chat.members = chat.members.filter(member => member.id !== user.id);

		await this._em.save(chat);
	}
}