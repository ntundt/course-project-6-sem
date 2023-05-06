import { EntityManager } from "typeorm";
import CommandHandlerBase from "../../Common/CommandHandlerBase";
import UserDto from "../../User/UserDto";
import { Chat } from "../../Chats/Chat";

export class GetChatMembersCommand {
	public chatId: number;
}

export class GetChatMembersCommandHandler extends CommandHandlerBase<GetChatMembersCommand, UserDto[]> {
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async handle(command: GetChatMembersCommand): Promise<UserDto[]> {
		const chat = await this._em.getRepository(Chat).findOne({
			where: {
				id: command.chatId,
			},
			relations: ['members'],
		});

		return chat.members.map(member => new UserDto(member));
	}
}
