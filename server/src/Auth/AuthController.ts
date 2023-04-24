import { Authorized, Body, CurrentUser, Get, JsonController, Post } from 'routing-controllers';
import { CheckPasswordCommand } from './Commands/CheckPasswordCommand';
import Mediator from '../Common/CommandMediator';
import TokenPayload from './TokenPayload';

import jwt from 'jsonwebtoken';

@JsonController()
export default class AuthController {
	@Authorized()
	@Get('/api/auth')
	public getAuth(@CurrentUser() tokenPayload: TokenPayload) {
		return tokenPayload;
	}

	@Post('/api/auth')
	public async getToken(@Body() command: CheckPasswordCommand) {
		let authResult = await Mediator.instance.sendCommand(command);

		return {
			authToken: jwt.sign({ ...authResult }, 'test_secret'),
			...authResult
		}
	}
}