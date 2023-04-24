import { EntityManager } from 'typeorm';
import { CreateNewMessageCommandHandler } from '../Messages/Commands/CreateNewMessageCommand';
import { CheckPasswordCommandHandler } from '../Auth/Commands/CheckPasswordCommand';
import { CreateChatCommandHandler } from '../Chats/Commands/CreateChatCommand';
import { GetChatListCommandHandler } from '../Chats/Commands/GetChatsListCommand';
import { EnsureUserIsChatMemberCommandHandler } from '../Messages/Commands/EnsureUserIsChatMemberCommand';
import { GetChatMessagesCommandHandler } from '../Messages/Commands/GetChatMessagesCommand';
import { GetChatInfoCommandHandler } from '../Chats/Commands/GetChatInfoCommand';
import CommandHandlerBase from './CommandHandlerBase';
import { EditMessageCommandHandler } from '../Messages/Commands/EditMessageCommand';
import { CreateAttachmentCommandHandler } from '../Attachments/Commands/CreateAttachment';
import { EditUserCommandHandler } from '../User/Commands/EditUserCommand';

export default class Mediator {
	private static _instance: Mediator;
	public static get instance(): Mediator {
		if (!Mediator._instance) {
			Mediator._instance = new Mediator();
		}
		return Mediator._instance;
	}

	private _em: EntityManager;

	private _commandHandlers: Map<string, any>;
	
	public setEntityManager(entityManager: EntityManager) {
		this._commandHandlers = new Map<string, any>();
		this._commandHandlers.set('CreateNewMessageCommand', new CreateNewMessageCommandHandler(entityManager));
		this._commandHandlers.set('CheckPasswordCommand', new CheckPasswordCommandHandler(entityManager));
		this._commandHandlers.set('CreateChatCommand', new CreateChatCommandHandler(entityManager));
		this._commandHandlers.set('GetChatListCommandHandler', new GetChatListCommandHandler(entityManager));
		this._commandHandlers.set('CreateNewMessageCommand', new CreateNewMessageCommandHandler(entityManager));
		// this._commandHandlers.set('EditMessageCommand', new EditMessageCommandHandler(entityManager));
		this._commandHandlers.set('EnsureUserIsChatMemberCommand', new EnsureUserIsChatMemberCommandHandler(entityManager));
		this._commandHandlers.set('GetChatMessagesCommand', new GetChatMessagesCommandHandler(entityManager));
		//this._commandHandlers.set('GetDialogsCommand', new GetDialogsCommandHandler(entityManager));
		this._commandHandlers.set('CreateChatCommand', new CreateChatCommandHandler(entityManager));
		this._commandHandlers.set('GetChatListCommand', new GetChatListCommandHandler(entityManager));
		this._commandHandlers.set('GetChatInfoCommand', new GetChatInfoCommandHandler(entityManager));
		this._commandHandlers.set('EditMessageCommand', new EditMessageCommandHandler(entityManager));
		this._commandHandlers.set('CreateAttachmentCommand', new CreateAttachmentCommandHandler(entityManager));
		this._commandHandlers.set('EditUserCommand', new EditUserCommandHandler(entityManager));
	}

	public registerHandler(handler: CommandHandlerBase<any, any>) {
		this._commandHandlers.set(handler.constructor.name, handler);
	}

	public async sendCommand(command: any): Promise<any> {
		let handler = this._commandHandlers.get(command.constructor.name);
		return (await handler.handle(command));
	}
}