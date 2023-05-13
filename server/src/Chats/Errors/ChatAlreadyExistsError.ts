import { BadRequestError } from 'routing-controllers';
import IApplicationError from '../../Common/Errors/IApplicationError';
import ApplicationErrorBase from '../../Common/Errors/ApplicationErrorBase';

export default class ChatAlreadyExistsError extends ApplicationErrorBase {
  public payload: object;
  public httpCode: number;
  public message: string;
  
  constructor(
    private readonly chatId: number,
  ) {
    super();
    this.payload = { chatId };
    this.httpCode = 400;
    this.message = `Chat with id ${chatId} already exists`;
  }


  public toJSON(): any {
    return {
      err: 400,
      message: this.message,
      payload: this.payload,
    };
  }
}
