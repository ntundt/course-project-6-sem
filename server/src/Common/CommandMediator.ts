import { EntityManager } from 'typeorm';

import { CheckPasswordCommandHandler } from '../Auth/Commands/CheckPasswordCommand';

import { CreateAttachmentCommandHandler } from '../Attachments/Commands/CreateAttachment';

import { CreateChatCommandHandler } from '../Chats/Commands/CreateChatCommand';
import { GetChatInfoCommandHandler } from '../Chats/Commands/GetChatInfoCommand';
import { GetChatListCommandHandler } from '../Chats/Commands/GetChatsListCommand';

import { AddChatMemberCommandHandler } from '../Messages/Commands/AddChatMemberCommand';
import { CreateNewMessageCommandHandler } from '../Messages/Commands/CreateNewMessageCommand';
import { EditMessageCommandHandler } from '../Messages/Commands/EditMessageCommand';
import { EnsureUserIsChatMemberCommandHandler } from '../Messages/Commands/EnsureUserIsChatMemberCommand';
import { GetChatMembersCommandHandler } from '../Messages/Commands/GetChatMembersCommand';
import { GetChatMessagesCommandHandler } from '../Messages/Commands/GetChatMessagesCommand';
import { MarkMessageAsReadCommandHandler } from '../Messages/Commands/MarkMessageAsReadCommand';
import { RemoveChatMemberCommandHandler } from '../Messages/Commands/RemoveChatMemberCommand';

import { CreateReportCommandHandler } from '../Reports/Commands/CreateReportCommand';
import { GetReportsListCommandHandler } from '../Reports/Commands/GetReportsListCommand';
import { ProcessReportCommandHandler } from '../Reports/Commands/ProcessReportCommand';

import { CreateUserCommandHandler } from '../User/Commands/CreateUserCommand';
import { EditUserCommandHandler } from '../User/Commands/EditUserCommand';
import { GetUserByIdCommandHandler } from '../User/Commands/GetUserByIdCommand';
import { SearchUsersCommandHandler } from '../User/Commands/SearchUsersCommand';

import { GetUserRoomsCommandHandler } from './Commands/GetUserRoomsCommand';
import CommandHandlerBase from './CommandHandlerBase';
import NotificataionService from './NotificationService';
import UserService from '../User/UserService';
import { EditChatCommandHandler } from '../Chats/Commands/EditChatCommand';


export default class Mediator {
	private static _instance: Mediator;
	public static get instance(): Mediator {
		if (!Mediator._instance) {
			Mediator._instance = new Mediator();
		}
		return Mediator._instance;
	}

	private _em: EntityManager;
	private _redis: any;
	private _notificationService: any;

	private _commandHandlers: Map<string, any>;
	
	public setEntityManager(entityManager: EntityManager) {
		this._em = entityManager;
	}

	public initCommandHandlers() {
		this._commandHandlers = new Map<string, any>();
		const handlers = [
			{ name: 'CreateNewMessageCommand', handler: CreateNewMessageCommandHandler },
			{ name: 'CheckPasswordCommand', handler: CheckPasswordCommandHandler },
			{ name: 'CreateChatCommand', handler: CreateChatCommandHandler },
			{ name: 'GetChatListCommandHandler', handler: GetChatListCommandHandler },
			{ name: 'CreateNewMessageCommand', handler: CreateNewMessageCommandHandler },
			{ name: 'EnsureUserIsChatMemberCommand', handler: EnsureUserIsChatMemberCommandHandler },
			{ name: 'GetChatMessagesCommand', handler: GetChatMessagesCommandHandler },
			{ name: 'CreateChatCommand', handler: CreateChatCommandHandler },
			{ name: 'GetChatListCommand', handler: GetChatListCommandHandler },
			{ name: 'GetChatInfoCommand', handler: GetChatInfoCommandHandler },
			{ name: 'EditMessageCommand', handler: EditMessageCommandHandler },
			{ name: 'CreateAttachmentCommand', handler: CreateAttachmentCommandHandler },
			{ name: 'EditUserCommand', handler: EditUserCommandHandler },
			{ name: 'CreateUserCommand', handler: CreateUserCommandHandler },
			{ name: 'CreateReportCommand', handler: CreateReportCommandHandler },
			{ name: 'ProcessReportCommand', handler: ProcessReportCommandHandler },
			{ name: 'GetReportsListCommand', handler: GetReportsListCommandHandler },
			{ name: 'AddChatMemberCommand', handler: AddChatMemberCommandHandler },
			{ name: 'RemoveChatMemberCommand', handler: RemoveChatMemberCommandHandler },
			{ name: 'GetUserByIdCommand', handler: GetUserByIdCommandHandler },
			{ name: 'MarkMessageAsReadCommand', handler: MarkMessageAsReadCommandHandler },
			{ name: 'GetUserRoomsCommand', handler: GetUserRoomsCommandHandler },
			{ name: 'GetChatMembersCommand', handler: GetChatMembersCommandHandler },
			{ name: 'SearchUsersCommand', handler: SearchUsersCommandHandler },
			{ name: 'EditChatCommand', handler: EditChatCommandHandler },
		];
		handlers.forEach(handler => {
			this._commandHandlers.set(handler.name, new handler.handler(this._em));
			this._commandHandlers.get(handler.name).setUserService(this.getUserService());
		});
	}

	public getEntityManager(): EntityManager {
		return this._em;
	}

	public setNotificationService(notificationService: NotificataionService) {
		this._notificationService = notificationService;
	}

	public getNotificationService(): NotificataionService {
		return this._notificationService;
	}

	public setRedis(redis: any) {
		this._redis = redis;
	}

	public getRedis(): any {
		return this._redis;
	}

	public getUserService() {
		return new UserService(this._redis);
	}

	public registerHandler(handler: CommandHandlerBase<any, any>) {
		this._commandHandlers.set(handler.constructor.name, handler);
	}

	public async sendCommand(command: any): Promise<any> {
		console.log(command)
		let handler = this._commandHandlers.get(command.constructor.name);
		return (await handler.handle(command));
	}
}
