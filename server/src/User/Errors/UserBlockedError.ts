import ApplicationErrorBase from '../../Common/Errors/ApplicationErrorBase';

export default class UserBlockedError extends ApplicationErrorBase {
	public payload: { id: number | string };
	public httpCode: number;
	public message: string;

	public constructor(id: number | string) {
		super();
		this.payload = { id };
		this.httpCode = 403;
		this.message = 'User ' + id + ' is blocked';
	}

	public toJSON() {
		return {
			err: 102,
			message: 'User ' + this.payload.id + ' is blocked'
		};
	}
}
