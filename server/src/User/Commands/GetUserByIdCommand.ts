import { EntityManager } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import UserDto from '../UserDto';
import { User } from '../User';

export class GetUserByIdCommand {
	public userId: number;
}

export class GetUserByIdCommandHandler extends CommandHandlerBase<GetUserByIdCommand, UserDto> {
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async handle(command: GetUserByIdCommand): Promise<UserDto> {
		const user = await this._em.findOneByOrFail(User, {
			id: command.userId,
		});

		return new UserDto(user);
	}

}