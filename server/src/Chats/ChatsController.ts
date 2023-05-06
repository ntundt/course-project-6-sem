import { Authorized, Body, CurrentUser, Get, JsonController, Post, UseBefore } from 'routing-controllers';
import { ChatDto } from './ChatDto';
import { GetChatListCommand } from './Commands/GetChatsListCommand';
import Mediator from '../Common/CommandMediator';
import { CreateChatCommand } from './Commands/CreateChatCommand';
import TokenPayload from '../Auth/TokenPayload';
import enableCors from '../Common/CorsEnabler';

@JsonController()
export default class ChatsController {

	@UseBefore(enableCors)
	@Authorized()
	@Get('/api/chats')
	public async getChats(
		@CurrentUser() user: TokenPayload,
	): Promise<ChatDto[]> {
		let command = new GetChatListCommand();

		command.userId = user.userId;

		return await Mediator.instance.sendCommand(command);
	}

	@UseBefore(enableCors)
	@Authorized()
	@Post('/api/chats')
	public async createChat(
		@Body() command: CreateChatCommand,
		@CurrentUser() user: TokenPayload,
	): Promise<ChatDto> {
		command.creatorId = user.userId;

		const result = await Mediator.instance.sendCommand(command);

		command.userIds.forEach(participant => {
			console.log(`Subscribing ${participant} to chat:${result.id}`);
			Mediator.instance.getNotificationService().subscribe(participant, `chat:${result.id}`);
		});

		Mediator.instance.getNotificationService().send(result.id, 'notification', {
			type: 'chatsList/chatAdded',
			payload: result,
		});

		return result;
	}

}