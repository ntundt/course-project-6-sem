import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, Put, QueryParam, UseBefore } from 'routing-controllers';
import TokenPayload from '../Auth/TokenPayload';
import Mediator from '../Common/CommandMediator';
import { EditUserCommand } from './Commands/EditUserCommand';
import EditUserCommandValidator from './Commands/EditUserCommandValidator';
import UserDto from './UserDto';
import { CreateUserCommand } from './Commands/CreateUserCommand';
import { CheckPasswordCommand, CheckPasswordCommandResult } from '../Auth/Commands/CheckPasswordCommand';
import { GetUserByIdCommand } from './Commands/GetUserByIdCommand';
import enableCors from '../Common/CorsEnabler';
import enableCache from '../Common/CacheEnabler';
import { SearchUsersCommand } from './Commands/SearchUsersCommand';
import { ExecutionResponseDto } from '../Common/ExecutionResponseDto';

@JsonController()
export default class UsersController {

	@UseBefore(enableCors)
	@Authorized()
	@Get('/api/users/search')
	public async searchUsers(
		@QueryParam('query') query: string,
	): Promise<UserDto[]> {
		const command = new SearchUsersCommand();

		command.query = query;

		return await Mediator.instance.sendCommand(command);
	}

	@UseBefore(enableCors)
	@Authorized()
	@Get('/api/username-available/:username')
	public async checkUsernameAvailability(
		@Param('username') username: string,
		@CurrentUser() user: TokenPayload,
	): Promise<ExecutionResponseDto> {
		const command = new SearchUsersCommand();

		command.query = username;

		const users = await Mediator.instance.sendCommand(command) as UserDto[];
		
		return new ExecutionResponseDto(users.filter(u => u.username === username && u.id !== user.userId).length === 0);
	}

	@UseBefore(enableCors)
	@Authorized()
	@Get('/api/current-user')
	public async getCurrentUser(
		@CurrentUser() user: TokenPayload,
	): Promise<UserDto> {
		const command = new GetUserByIdCommand();

		command.userId = user.userId;

		return await Mediator.instance.sendCommand(command);
	}

	@UseBefore(enableCors)
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

	@UseBefore(enableCache)
	@UseBefore(enableCors)
	@Authorized()
	@Get('/api/users/:userId')
	public async getUser(
		@Param('userId') userId: number,
	): Promise<UserDto> {
		const command = new GetUserByIdCommand();

		command.userId = userId;

		return await Mediator.instance.sendCommand(command);
	}

	@UseBefore(enableCors)
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

	@UseBefore(enableCors)
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
