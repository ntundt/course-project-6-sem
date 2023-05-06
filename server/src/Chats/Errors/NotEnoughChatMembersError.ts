import { BadRequestError } from 'routing-controllers';
import IApplicationError from '../../Common/Errors/IApplicationError';

export default class NotEnoughChatMembersError extends BadRequestError implements IApplicationError {
  constructor() {
    super('You must specify at least one member apart from yourself to create a chat.');
  }

  public toJSON() {
    return {
      err: 401,
      message: this.message,
    };
  }
}
