import { HttpError } from 'routing-controllers';

export default class ChatNotFoundError extends HttpError {
	private chatId: number | string;

	public constructor(id: number | string) {
		super(404, 'Chat ' + id + ' not found');
		this.chatId = id;
	}

	public toJSON() {
		return {
			err: 101,
			message: 'Chat ' + this.chatId + ' not found'
		};
	}
}