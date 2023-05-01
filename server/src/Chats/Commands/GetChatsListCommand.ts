import { EntityManager, Repository } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Chat } from '../Chat';
import { ChatDto } from '../ChatDto';
import { getAttachmentUrl } from '../../Attachments/Attachment';
import { Message } from '../../Messages/Message';

export class GetChatListCommand {
	public userId: number;
}

export class GetChatListCommandHandler extends CommandHandlerBase<GetChatListCommand, ChatDto[]> {
	private chatRepository: Repository<Chat>
	
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async handle(command: GetChatListCommand): Promise<ChatDto[]> {
		const chats = await this._em.getRepository(Chat)
			.createQueryBuilder("chat")
			.leftJoinAndSelect("chat.creator", "creator")
			.leftJoinAndSelect("chat.members", "members")
			.leftJoin(
				`(SELECT message.destinationChatId, MAX(message.createdAt) as maxDate FROM message message GROUP BY message.destinationChatId)`,
				"latest",
				"latest.destinationChatId = chat.id"
			)
			.leftJoinAndMapMany(
				"chat.messages",
				Message,
				"message",
				"message.destinationChatId = chat.id AND message.createdAt = latest.maxDate"
			)
			.where(subQuery => {
				const subQueryAlias = subQuery.subQuery();
				const subQuerySelect = subQueryAlias
					.select("1")
					.from("chat_members_user", "cmu")
					.where("cmu.chatId = chat.id")
					.andWhere("cmu.userId = :userId", { userId: command.userId })
					.getQuery();
				return "exists " + subQuerySelect;
			})
			.leftJoinAndSelect("message.sender", "sender")
			.leftJoinAndSelect("message.attachments", "attachments")
			.orderBy("message.createdAt", "DESC")
			.getMany();

		chats.forEach(chat => {
			if (!chat.isPrivate) return;

			const otherMember = chat.members.find(member => member.id !== command.userId);
			chat.name = otherMember.name;
			chat.avatar = otherMember.profilePicUrl;
		});

		return chats.map(chat => new ChatDto(chat));
	}
}

