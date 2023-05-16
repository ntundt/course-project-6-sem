import HttpValidatorBase from '../../Common/HttpValidatorBase';
import { EditUserCommand } from './EditUserCommand';
import { z } from 'zod';

export default class EditUserCommandValidator extends HttpValidatorBase<EditUserCommand> {
	constructor() {
		super({
			userId: z.number().int().positive(),
			email: z.string().email().optional(),
			name: z.string().min(1).max(255).optional(),
			username: z.string().min(1).max(255).regex(/^[a-zA-Z0-9_\.]+$/).optional(),
			avatar: z.string().regex(/^\/uploads\/[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}\.[a-z0-9]{3,4}$/).optional(),
			currentPassword: z.string().min(6).max(255).optional(),
			newPassword: z.string().min(6).max(255).optional(),
		});
	}
}
