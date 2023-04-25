import { EntityManager } from 'typeorm';
import { User, generateSalt, getPasswordHash } from '../User';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import UserDto from '../UserDto';
import { HttpError } from 'routing-controllers';

export class CreateUserCommand {
	public username: string;
	public password: string;
}

export class CreateUserCommandHandler extends CommandHandlerBase<CreateUserCommand, UserDto> {
	constructor(private _entityManager: EntityManager) {
		super(_entityManager);
	}

	public async handle(command: CreateUserCommand): Promise<UserDto> {
		let user = new User();
		
		user.username = command.username;
		user.name = command.username;
		user.salt = generateSalt();
		user.passwordHash = getPasswordHash(command.password, user.salt);

		try {
			user = await this._entityManager.save(user);
		} catch (e) {
			throw new HttpError(409, 'User with the same username already exists');
		}

		return new UserDto(user);
	}
}
