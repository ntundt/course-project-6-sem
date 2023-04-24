import { Request, Response } from 'express';
import Mediator from '../Common/CommandMediator';
import { CreateNewMessageCommand } from './Commands/CreateNewMessageCommand';
import { Authorized, Body, JsonController, Get, Header, Post, QueryParam, Param, Put, CurrentUser } from 'routing-controllers';
import { GetChatMessagesCommand } from './Commands/GetChatMessagesCommand';
import MessageDto from './MessageDto';
import { EditMessageCommand } from './Commands/EditMessageCommand';
import TokenPayload from '../Auth/TokenPayload';

// TODO: Create a trigger that makes sure that a user is in fact a chat member, before allowing it to send message into the chat

@Authorized()
@JsonController()
export default class MessageController {

	@Get('/api/chats/:chatId/messages')
	@Header('Cache-Control', 'none')
	public async getGroupChatMessages(
		@Param('chatId') chatId: number,
		@QueryParam('offset') offset: number,
		@QueryParam('limit') limit: number,
		@CurrentUser() user: TokenPayload,
	): Promise<MessageDto[]> {
		let command = new GetChatMessagesCommand();

		command.userId = user.userId;
		command.chatId = chatId;
		command.offset = offset;
		command.count = limit;

		return await Mediator.instance.sendCommand(command);
	}

	@Post('/api/chats/:chatId/messages')
	public async sendMessage(
		@Param('chatId') chatId: number,
		@Body() command: CreateNewMessageCommand,
		@CurrentUser() user: TokenPayload,
	): Promise<MessageDto> {
		console.log('command: ', command.text);

		command.senderId = user.userId;
		command.chatId = chatId;
		if (!command.attachmentIds) {
			command.attachmentIds = [];
		}

		return await Mediator.instance.sendCommand(command);
	}

	@Put('/api/chats/:chatId/messages/:messageId')
	public async editMessage(
		@Param('chatId') chatId: number,
		@Param('messageId') messageId: number,
		@Body() command: EditMessageCommand,
		@CurrentUser() user: TokenPayload,
	): Promise<MessageDto> {
		command.editorId = user.userId;
		command.chatId = chatId;
		command.messageId = messageId;

		return await Mediator.instance.sendCommand(command);
	}

}
