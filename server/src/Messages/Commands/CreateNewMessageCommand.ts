import { EntityManager, Repository } from 'typeorm';
import { Message } from '../Message';
import { Attachment } from '../../Attachments/Attachment';
import { User } from '../../User/User';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import MessagesService from '../MessagesService';
import ChatNotFoundError from '../../Common/Errors/ChatNotFoundError';
import MessageDto from '../MessageDto';

export class CreateNewMessageCommand {
	public senderId: number;
	public chatId: number;
	public text: string;
	public attachmentIds: string[];
}

export class CreateNewMessageCommandHandler extends CommandHandlerBase<CreateNewMessageCommand, MessageDto> {
	private messageRepository: Repository<Message>;
	private userRepository: Repository<User>;

	public constructor(entityManager: EntityManager) {
		super(entityManager);

		this.messageRepository = entityManager.getRepository(Message);
		this.userRepository = entityManager.getRepository(User);
	}

	public async handle(command: CreateNewMessageCommand): Promise<MessageDto> {
		const isChatMember = new MessagesService(this._em).userIsChatMember(command.senderId, command.chatId);
		if (!isChatMember) {
			throw new ChatNotFoundError(command.chatId);
		}

		let message = new Message;
		message.senderId = command.senderId;
		message.destinationChatId = command.chatId;
		message.text = command.text;

		message.attachments = command.attachmentIds.map(id => {
			const attachment = new Attachment()
			attachment.id = id;
			return attachment;
		});

		message = await this.messageRepository.save(message);

		return new MessageDto(message);
	}
}
