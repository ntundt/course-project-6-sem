import { BadRequestError } from 'routing-controllers';
import IApplicationError from '../../Common/Errors/IApplicationError';

export default class ChatAlreadyExistsError extends BadRequestError implements IApplicationError {
  constructor(
    private readonly chatId: number,
  ) {
    super('The chat already exists.');
  }

  public getChatId(): number {
    return this.chatId;
  }

  public toJSON(): any {
    return {
      err: 400,
      message: this.message,
      action: {
        type: 'chatsList/chatSelected',
        payload: {
          chatId: this.getChatId(),
        },
      }
    };
  }
}
