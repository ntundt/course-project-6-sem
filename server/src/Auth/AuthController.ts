import { Authorized, Body, CurrentUser, Get, JsonController, Post, UseBefore } from 'routing-controllers';
import { CheckPasswordCommand } from './Commands/CheckPasswordCommand';
import Mediator from '../Common/CommandMediator';
import TokenPayload from './TokenPayload';

import jwt from 'jsonwebtoken';
import enableCors from '../Common/CorsEnabler';

@JsonController()
export default class AuthController {

	@UseBefore(enableCors)
	@Authorized()
	@Get('/api/auth')
	public getAuth(@CurrentUser() tokenPayload: TokenPayload) {
		return tokenPayload;
	}

	@UseBefore(enableCors)
	@Post('/api/auth')
	public async getToken(@Body() command: CheckPasswordCommand) {
		let authResult = await Mediator.instance.sendCommand(command);

		return {
			authToken: jwt.sign({ ...authResult }, 'test_secret'),
			...authResult
		}
	}
}