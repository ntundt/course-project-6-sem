import ApplicationErrorBase from '../../Common/Errors/ApplicationErrorBase';

export default class UserNotFoundError extends ApplicationErrorBase {
	public payload: { id: number | string };
	public httpCode: number;
	public message: string;

	public constructor(id: number | string) {
		super();
		this.payload = { id };
		this.httpCode = 404;
		this.message = 'User ' + id + ' not found';
	}

	public toJSON() {
		return {
			err: 101,
			message: 'User ' + this.payload.id + ' not found'
		};
	}
}
