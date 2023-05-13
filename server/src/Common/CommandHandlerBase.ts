import { EntityManager } from 'typeorm';
import Mediator from './CommandMediator';
import UserService from '../User/UserService';

export default abstract class CommandHandlerBase<TCommand, TResult> {
	protected _em: EntityManager;
	protected _userService: UserService;

	public constructor(entityManager: EntityManager) {
		this._em = entityManager;

		Mediator.instance.registerHandler(this);
	}

	public setUserService(userService: UserService) {
		this._userService = userService;
	}

	abstract handle(command: TCommand): Promise<TResult>;
}