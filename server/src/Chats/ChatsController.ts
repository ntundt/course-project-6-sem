import { Authorized, Body, CurrentUser, Get, JsonController, Post } from 'routing-controllers';
import { ChatDto } from './ChatDto';
import { GetChatListCommand } from './Commands/GetChatsListCommand';
import Mediator from '../Common/CommandMediator';
import { CreateChatCommand } from './Commands/CreateChatCommand';
import TokenPayload from '../Auth/TokenPayload';

@JsonController()
export default class ChatsController {

	@Authorized()
	@Get('/api/chats')
	public async getChats(
		@CurrentUser() user: TokenPayload,
	): Promise<ChatDto[]> {
		let command = new GetChatListCommand();

		command.userId = user.userId;

		return await Mediator.instance.sendCommand(command);
	}

	@Authorized()
	@Post('/api/chats')
	public async createChat(
		@Body() command: CreateChatCommand,
		@CurrentUser() user: TokenPayload,
	): Promise<ChatDto> {
		console.log('user: ', user);

		command.creatorId = user.userId;

		return await Mediator.instance.sendCommand(command);
	}

}