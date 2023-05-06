import { EntityManager, In } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Chat } from '../Chat';
import { User } from '../../User/User';
import UserNotFoundError from '../../User/Errors/UserNotFoundError';
import Mediator from '../../Common/CommandMediator';
import { ChatDto } from '../ChatDto';
import { BadRequestError } from 'routing-controllers';
import ChatAlreadyExistsError from '../Errors/ChatAlreadyExistsError';
import NotEnoughChatMembersError from '../Errors/NotEnoughChatMembersError';

export class CreateChatCommand {
	public creatorId: number;
	public isPrivate: boolean;
	public name: string;
	public userIds: number[];
}

export class CreateChatCommandHandler extends CommandHandlerBase<CreateChatCommand, ChatDto> {
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	private async addCreatorToMembers(tem: EntityManager, users: User[], creatorId: number) {
		if (users.map(user => user.id).indexOf(creatorId) === -1) {
			users.push(await tem.getRepository(User).findOneBy({
				id: creatorId,
			}));
		}
	}

	private async throwIfChatExists(tem: EntityManager, userIds: number[]) {
		const existingChat = await tem.getRepository(Chat).findOne({
			where: {
				isPrivate: true,
				members: userIds.map(userId => ({ id: userId })),
			},
		});

		if (existingChat) {
			throw new ChatAlreadyExistsError(existingChat.id);
		}
	}

	public async handle(command: CreateChatCommand) {
		return await this._em.transaction(async (tem): Promise<ChatDto> => {
			const users = await tem.getRepository(User).findBy({
				id: In(command.userIds),
			});
			
			if (users.length != command.userIds.length) {
				throw new UserNotFoundError(command.userIds.filter(userId => !users.some(user => user.id === userId))[0]);
			}

			await this.addCreatorToMembers(tem, users, command.creatorId);

			if (users.length < 2) {
				throw new NotEnoughChatMembersError();
			}

			if (users.length === 2 && command.isPrivate) {
				await this.throwIfChatExists(tem, users.map(user => user.id));
			}

			let createdChat = (await tem.getRepository(Chat).save({
				creatorId: command.creatorId,
				name: command.name,
				isPrivate: command.isPrivate,
				members: users,
			}));

			const chat = await tem.getRepository(Chat).findOne({
				where: {
					id: createdChat.id,
				},
				relations: ['members'],
			});

			return new ChatDto(chat);
		});
	}

}