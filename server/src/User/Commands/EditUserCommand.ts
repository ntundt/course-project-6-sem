import { EntityManager, Repository } from 'typeorm';
import { User, generateSalt, getPasswordHash } from '../User';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { NotFoundError } from 'routing-controllers';
import UserDto from '../UserDto';
import { CheckPasswordCommand, CheckPasswordCommandResult } from '../../Auth/Commands/CheckPasswordCommand';
import Mediator from '../../Common/CommandMediator';

export class EditUserCommand {
	public userId: number;
	public email?: string;
	public name?: string;
	public username?: string;
	public avatar?: string;
	public currentPassword?: string;
	public newPassword?: string;
}

export class EditUserCommandHandler extends CommandHandlerBase<EditUserCommand, UserDto> {
	private userRepository: Repository<User>;

	public constructor(entityManager: EntityManager) {
		super(entityManager);

		this.userRepository = entityManager.getRepository(User);
	}

	public async handle(command: EditUserCommand): Promise<UserDto> {
		const user = await this.userRepository.findOneBy({ id: command.userId });

		if (!user) {
			throw new NotFoundError('User not found');
		}

		if (command.email) {
			user.email = command.email;
		}

		if (command.name) {
			user.name = command.name;
		}

		if (command.username) {
			user.username = command.username;
		}

		if (command.avatar) {
			user.profilePicUrl = command.avatar;
		}

		if (command.newPassword) {
			const checkPasswordCommand = new CheckPasswordCommand();
			checkPasswordCommand.username = user.username;
			checkPasswordCommand.password = command.currentPassword;
			await Mediator.instance.sendCommand(checkPasswordCommand);

			const newSalt = generateSalt();
			user.salt = newSalt;
			user.passwordHash = getPasswordHash(command.newPassword, newSalt);
		}

		const newUser = await this.userRepository.save(user);

		return new UserDto(newUser);
	}
}
