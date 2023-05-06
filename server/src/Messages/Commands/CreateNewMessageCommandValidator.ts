import HttpValidatorBase from '../../Common/HttpValidatorBase';
import { CreateNewMessageCommand } from './CreateNewMessageCommand';
import { z } from 'zod';

export default class CreateNewMesssageCommandValidator extends HttpValidatorBase<CreateNewMessageCommand> {
	constructor() {
		super({
      senderId: z.number().int().positive(),
      chatId: z.number().int().positive(),
      text: z.string().min(1).max(4096),
      attachmentIds: z.array(z.number().int().positive()).max(10),
		});
	}
}