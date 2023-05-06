import { EntityManager, Like } from "typeorm";
import CommandHandlerBase from "../../Common/CommandHandlerBase";
import UserDto from "../UserDto";
import { User } from "../User";

export class SearchUsersCommand {
		public query: string;
}

export class SearchUsersCommandHandler extends CommandHandlerBase<SearchUsersCommand, UserDto[]> {
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async handle(command: SearchUsersCommand): Promise<UserDto[]> {
		const users = await this._em.getRepository(User).find({
			where: {
				username: Like(`%${command.query}%`),
			},
			take: 10,
		});

		return users.map(user => new UserDto(user));
	}
}
