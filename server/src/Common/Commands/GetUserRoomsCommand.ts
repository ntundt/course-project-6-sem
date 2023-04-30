import { EntityManager } from 'typeorm';
import CommandHandlerBase from '../CommandHandlerBase';
import { Chat } from '../../Chats/Chat';
import { User } from '../../User/User';

export class GetUserRoomsCommand {
	public userId: number;
}

export class GetUserRoomsCommandResult {
	public rooms: string[];
}

export class GetUserRoomsCommandHandler extends CommandHandlerBase<GetUserRoomsCommand, GetUserRoomsCommandResult> {
	public constructor(enitityManager: EntityManager) {
		super(enitityManager);
	}

	public async handle(command: GetUserRoomsCommand): Promise<GetUserRoomsCommandResult> {
		const result = new GetUserRoomsCommandResult();

		const chats = await this._em.getRepository(Chat).find({ where: { members: { id: command.userId } } });
		result.rooms = chats.map(chat => `chat:${chat.id}`);

		const userIsAdmin = (await this._em.getRepository(User).findOne({ where: { id: command.userId } })).isAdmin;
		if (userIsAdmin) {
			result.rooms.push('reports');
		}

		return result;
	}
}