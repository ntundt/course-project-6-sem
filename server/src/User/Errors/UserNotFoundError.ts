import { HttpError } from 'routing-controllers';

export default class UserNotFoundError extends HttpError {
	private userId: number | string;

	public constructor(id: number | string) {
		super(404, 'User ' + id + ' not found');
		this.userId = id;
	}

	public toJSON() {
		return {
			err: 101,
			message: 'User ' + this.userId + ' not found'
		};
	}
}