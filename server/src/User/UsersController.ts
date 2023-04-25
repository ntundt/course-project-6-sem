import { Authorized, Body, CurrentUser, JsonController, Param, Post, Put } from 'routing-controllers';
import TokenPayload from '../Auth/TokenPayload';
import Mediator from '../Common/CommandMediator';
import { EditUserCommand } from './Commands/EditUserCommand';
import EditUserCommandValidator from './Commands/EditUserCommandValidator';
import UserDto from './UserDto';
import { CreateUserCommand } from './Commands/CreateUserCommand';
import { CheckPasswordCommand, CheckPasswordCommandResult } from '../Auth/Commands/CheckPasswordCommand';

@JsonController()
export default class UsersController {

	@Authorized([ 'admin' ])
	@Put('/api/users/:userId')
	public async editUser(
		@Param('userId') userId: number,
		@Body() command: EditUserCommand,
		@CurrentUser() user: TokenPayload,
	): Promise<UserDto> {
		command.userId = userId;

		return await Mediator.instance.sendCommand(command);
	}

	@Authorized()
	@Put('/api/current-user')
	public async editCurrentUser(
		@Body() command: EditUserCommand,
		@CurrentUser() user: TokenPayload,
	): Promise<UserDto> {
		command.userId = user.userId;

		new EditUserCommandValidator().validateAndThrow(command);

		return await Mediator.instance.sendCommand(command);
	}

	@Post('/api/users')
	public async createUser(
		@Body() command: CreateUserCommand,
	): Promise<CheckPasswordCommandResult> {
		await Mediator.instance.sendCommand(command);

		const checkPasswordCommand = new CheckPasswordCommand();
		checkPasswordCommand.username = command.username;
		checkPasswordCommand.password = command.password;

		return await Mediator.instance.sendCommand(checkPasswordCommand);
	}

}
