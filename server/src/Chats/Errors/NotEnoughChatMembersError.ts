import { BadRequestError } from 'routing-controllers';
import IApplicationError from '../../Common/Errors/IApplicationError';
import ApplicationErrorBase from '../../Common/Errors/ApplicationErrorBase';

export default class NotEnoughChatMembersError extends ApplicationErrorBase {
  public payload: object;
  public httpCode: number;
  public message: string;
  
  constructor() {
    super();
    this.payload = {};
    this.httpCode = 400;
    this.message = `Chat must have at least 2 members`;
  }

  public toJSON() {
    return {
      err: 401,
      message: this.message,
    };
  }
}
