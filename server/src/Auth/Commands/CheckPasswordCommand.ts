import { EntityManager } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { User } from '../../User/User';

import crypto from 'crypto';
import UserNotFoundError from '../../User/Errors/UserNotFoundError';
import WrongPasswordError from '../Errors/WrongPasswordError';

export class CheckPasswordCommand {
	username: string;
	password: string;
}

export class CheckPasswordCommandResult {
	userId: number;
	isModerator: boolean;
	expiresAt: number;
}

export class CheckPasswordCommandHandler extends CommandHandlerBase<CheckPasswordCommand, CheckPasswordCommandResult> {

	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async handle(command: CheckPasswordCommand): Promise<CheckPasswordCommandResult> {
		const user = await this._em.getRepository(User).findOneBy({
			username: command.username
		});

		if (user === null) {
			throw new UserNotFoundError(command.username);
		}

		const expectedHash = crypto.createHash('sha256').update(command.password + user.salt).digest('hex');
		
		console.log(expectedHash, user.passwordHash);

		if (expectedHash !== user.passwordHash) {
			const err = new WrongPasswordError();
			console.log(err.toString());
			console.log(Object.getOwnPropertyNames(err).filter(item => typeof err[item] === 'function'));
			throw err;
		}

		const commandResult = new CheckPasswordCommandResult();
		commandResult.userId = user.id;
		commandResult.isModerator = user.isAdmin;
		commandResult.expiresAt = Math.floor(new Date().getTime() / 1000) + 3600;

		return commandResult;
	}

}