import { HttpError } from 'routing-controllers';
import ApplicationErrorBase from '../../Common/Errors/ApplicationErrorBase';

export default class WrongPasswordError extends ApplicationErrorBase {
	public payload: object | undefined;
	public httpCode: number = 400;
	public message: string = 'Wrong password';
	
	public constructor() {
		super();
	}

	public toJSON() {
		return {
			err: 100,
			message: 'Wrong password'
		}
	}
}