import { EntityManager, In } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Chat } from '../Chat';
import { User } from '../../User/User';
import UserNotFoundError from '../../Common/Errors/UserNotFoundError';
import Mediator from '../../Common/CommandMediator';

export class CreateChatCommand {
	public creatorId: number;
	public isPrivate: boolean;
	public name: string;
	public userIds: number[];
}

export class CreateChatCommandHandler extends CommandHandlerBase<CreateChatCommand, Chat> {
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async handle(command: CreateChatCommand) {
		return await this._em.transaction(async (tem): Promise<Chat> => {
			const users = await tem.getRepository(User).findBy({
				id: In(command.userIds),
			});
			
			if (users.length != command.userIds.length) {
				throw new UserNotFoundError(command.userIds.filter(userId => !users.some(user => user.id === userId))[0]);
			}

			if (users.map(user => user.id).indexOf(command.creatorId) === -1) {
				users.push(await tem.getRepository(User).findOneBy({
					id: command.creatorId,
				}));
			}

			return (await tem.getRepository(Chat).save({
				creatorId: command.creatorId,
				name: command.name,
				isPrivate: command.isPrivate,
				members: users,
			}));
		});
	}

}