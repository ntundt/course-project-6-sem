import { EntityManager } from 'typeorm';
import Mediator from './CommandMediator';

export default abstract class QueryHandlerBase<TCommand, TResult> {
	protected _em: EntityManager;
	
	public constructor(entityManager: EntityManager) {
		this._em = entityManager;

		//Mediator.instance.registerHandler(this);
	}

	abstract handle(command: TCommand): Promise<TResult>;
}
