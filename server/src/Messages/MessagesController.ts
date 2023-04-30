import { Request, Response } from 'express';
import Mediator from '../Common/CommandMediator';
import { CreateNewMessageCommand } from './Commands/CreateNewMessageCommand';
import { Authorized, Body, JsonController, Get, Header, Post, QueryParam, Param, Put, CurrentUser, Delete, UseBefore } from 'routing-controllers';
import { GetChatMessagesCommand } from './Commands/GetChatMessagesCommand';
import MessageDto from './MessageDto';
import { EditMessageCommand } from './Commands/EditMessageCommand';
import TokenPayload from '../Auth/TokenPayload';
import { AddChatMemberCommand } from './Commands/AddChatMemberCommand';
import { RemoveChatMemberCommand } from './Commands/RemoveChatMemberCommand';
import enableCors from '../Common/CorsEnabler';
import { MarkMessageAsReadCommand } from './Commands/MarkMessageAsReadCommand';
import { ExecutionResponseDto } from '../Common/ExecutionResponseDto';

// TODO: Create a trigger that makes sure that a user is in fact a chat member, before allowing it to send message into the chat

@Authorized()
@JsonController()
export default class MessageController {

	@UseBefore(enableCors)
	@Get('/api/chats/:chatId/messages')
	@Header('Cache-Control', 'none')
	public async getGroupChatMessages(
		@Param('chatId') chatId: number,
		@QueryParam('offset') offset: number,
		@QueryParam('count') count: number,
		@CurrentUser() user: TokenPayload,
	): Promise<MessageDto[]> {
		let command = new GetChatMessagesCommand();

		command.userId = user.userId;
		command.chatId = chatId;
		command.offset = offset;
		command.count = count;

		return await Mediator.instance.sendCommand(command);
	}

	@UseBefore(enableCors)
	@Post('/api/chats/:chatId/messages')
	public async sendMessage(
		@Param('chatId') chatId: number,
		@Body() command: CreateNewMessageCommand,
		@CurrentUser() user: TokenPayload,
	): Promise<MessageDto> {
		command.senderId = user.userId;
		command.chatId = chatId;
		if (!command.attachmentIds) {
			command.attachmentIds = [];
		}

		const message = await Mediator.instance.sendCommand(command);

		Mediator.instance.getNotificationService().send(`chat:${chatId}`, 'notification', {
			type: 'chatsList/messageReceived',
			payload: message,
		});

		return message;
	}

	@UseBefore(enableCors)
	@Post('/api/chats/:chatId/messages/:messageId/read')
	public async markMessageAsRead(
		@Param('chatId') chatId: number,
		@Param('messageId') messageId: number,
		@CurrentUser() user: TokenPayload,
	): Promise<ExecutionResponseDto> {
		const command = new MarkMessageAsReadCommand();

		command.userId = user.userId;
		command.chatId = chatId;
		command.messageId = messageId;

		await Mediator.instance.sendCommand(command);

		Mediator.instance.getNotificationService().send(`chat:${chatId}`, 'notification', {
			type: 'chatsList/messageRead',
			payload: {
				messageId,
				chatId,
			},
		});

		return new ExecutionResponseDto(true);
	}

	@UseBefore(enableCors)
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

	@UseBefore(enableCors)
	@Post('/api/chats/:chatId/members/:userId')
	public async addMemberToChat(
		@Param('chatId') chatId: number,
		@Param('userId') userId: number,
		@CurrentUser() user: TokenPayload,
	): Promise<void> {
		const command = new AddChatMemberCommand();
		
		command.adderId = user.userId;
		command.chatId = chatId;
		command.userId = userId;

		await Mediator.instance.sendCommand(command);
	}

	@UseBefore(enableCors)
	@Delete('/api/chats/:chatId/members/:userId')
	public async removeMemberFromChat(
		@Param('chatId') chatId: number,
		@Param('userId') userId: number,
		@CurrentUser() user: TokenPayload,
	): Promise<void> {
		const command = new RemoveChatMemberCommand();
		
		command.removerId = user.userId;
		command.chatId = chatId;
		command.userId = userId;

		await Mediator.instance.sendCommand(command);
	}

}
