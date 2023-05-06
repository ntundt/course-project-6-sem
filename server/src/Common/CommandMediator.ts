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


export default class Mediator {
	private static _instance: Mediator;
	public static get instance(): Mediator {
		if (!Mediator._instance) {
			Mediator._instance = new Mediator();
		}
		return Mediator._instance;
	}

	private _em: EntityManager;
	private _notificationService: any;

	private _commandHandlers: Map<string, any>;
	
	public setEntityManager(entityManager: EntityManager) {
		this._commandHandlers = new Map<string, any>();
		this._commandHandlers.set('CreateNewMessageCommand', new CreateNewMessageCommandHandler(entityManager));
		this._commandHandlers.set('CheckPasswordCommand', new CheckPasswordCommandHandler(entityManager));
		this._commandHandlers.set('CreateChatCommand', new CreateChatCommandHandler(entityManager));
		this._commandHandlers.set('GetChatListCommandHandler', new GetChatListCommandHandler(entityManager));
		this._commandHandlers.set('CreateNewMessageCommand', new CreateNewMessageCommandHandler(entityManager));
		this._commandHandlers.set('EnsureUserIsChatMemberCommand', new EnsureUserIsChatMemberCommandHandler(entityManager));
		this._commandHandlers.set('GetChatMessagesCommand', new GetChatMessagesCommandHandler(entityManager));
		this._commandHandlers.set('CreateChatCommand', new CreateChatCommandHandler(entityManager));
		this._commandHandlers.set('GetChatListCommand', new GetChatListCommandHandler(entityManager));
		this._commandHandlers.set('GetChatInfoCommand', new GetChatInfoCommandHandler(entityManager));
		this._commandHandlers.set('EditMessageCommand', new EditMessageCommandHandler(entityManager));
		this._commandHandlers.set('CreateAttachmentCommand', new CreateAttachmentCommandHandler(entityManager));
		this._commandHandlers.set('EditUserCommand', new EditUserCommandHandler(entityManager));
		this._commandHandlers.set('CreateUserCommand', new CreateUserCommandHandler(entityManager));
		this._commandHandlers.set('CreateReportCommand', new CreateReportCommandHandler(entityManager));
		this._commandHandlers.set('ProcessReportCommand', new ProcessReportCommandHandler(entityManager));
		this._commandHandlers.set('GetReportsListCommand', new GetReportsListCommandHandler(entityManager));
		this._commandHandlers.set('AddChatMemberCommand', new AddChatMemberCommandHandler(entityManager));
		this._commandHandlers.set('RemoveChatMemberCommand', new RemoveChatMemberCommandHandler(entityManager));
		this._commandHandlers.set('GetUserByIdCommand', new GetUserByIdCommandHandler(entityManager));
		this._commandHandlers.set('MarkMessageAsReadCommand', new MarkMessageAsReadCommandHandler(entityManager));
		this._commandHandlers.set('GetUserRoomsCommand', new GetUserRoomsCommandHandler(entityManager));
		this._commandHandlers.set('GetChatMembersCommand', new GetChatMembersCommandHandler(entityManager));
		this._commandHandlers.set('SearchUsersCommand', new SearchUsersCommandHandler(entityManager));
	}

	public setNotificationService(notificationService: NotificataionService) {
		this._notificationService = notificationService;
	}

	public getNotificationService(): NotificataionService {
		return this._notificationService;
	}

	public registerHandler(handler: CommandHandlerBase<any, any>) {
		this._commandHandlers.set(handler.constructor.name, handler);
	}

	public async sendCommand(command: any): Promise<any> {
		console.log(command.constructor.name)
		let handler = this._commandHandlers.get(command.constructor.name);
		return (await handler.handle(command));
	}
}
