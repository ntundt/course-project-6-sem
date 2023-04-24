import { HttpError } from 'routing-controllers';

export default class WrongPasswordError extends HttpError {
	public constructor() {
		super(400);
	}

	public toJSON() {
		return {
			err: 100,
			message: 'Wrong password'
		}
	}
}