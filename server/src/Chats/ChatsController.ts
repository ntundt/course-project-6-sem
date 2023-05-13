import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers';
import { ChatDto } from './ChatDto';
import { GetChatListCommand } from './Commands/GetChatsListCommand';
import Mediator from '../Common/CommandMediator';
import { CreateChatCommand } from './Commands/CreateChatCommand';
import TokenPayload from '../Auth/TokenPayload';
import enableCors from '../Common/CorsEnabler';
import { EditChatCommand } from './Commands/EditChatCommand';
import { GetChatInfoCommand } from './Commands/GetChatInfoCommand';

@JsonController()
export default class ChatsController {
	
	@UseBefore(enableCors)
	@Authorized()
	@Get('/api/chats/:chatId')
	public async getChat(
		@CurrentUser() user: TokenPayload,
		@Param('chatId') chatId: number,
	): Promise<ChatDto> {
		let command = new GetChatInfoCommand();
	
		command.chatId = chatId;
	
		return await Mediator.instance.sendCommand(command);
	}
	
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

		if (!command.userIds.includes(user.userId)) {
			command.userIds.push(user.userId);
		}

		command.userIds.forEach(participant => {
			console.log(`Subscribing ${participant} to chat:${result.id}`);
			Mediator.instance.getNotificationService().subscribe(participant, `chat:${result.id}`);
		});

		Mediator.instance.getNotificationService().send(`chat:${result.id}`, 'notification', {
			type: 'chatsList/chatAdded',
			payload: result,
		});

		return result;
	}

	@UseBefore(enableCors)
	@Authorized()
	@Put('/api/chats/:chatId')
	public async editChat(
		@Body() command: EditChatCommand,
		@CurrentUser() user: TokenPayload,
		@Param('chatId') chatId: number,
	): Promise<ChatDto> {
		command.userId = user.userId;
		command.chatId = chatId;

		const result = await Mediator.instance.sendCommand(command);

		Mediator.instance.getNotificationService().send(`chat:${result.id}`, 'notification', {
			type: 'chatsList/chatEdited',
			payload: result,
		});

		return result;
	}



}