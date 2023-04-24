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
			.orderBy("message.createdAt", "DESC")
			.getMany();

		console.log(chats);

		return chats.map(chat => {
			return {
				id: chat.id,
				name: chat.name,
				type: chat.isPrivate ? "private" : "group",
				avatar: chat.avatar,
				creator: {
					id: chat.creator.id,
					name: chat.creator.name,
					avatarUrl: chat.creator.profilePicUrl
				},
				members: chat.members.map(member => ({
					id: member.id,
					name: member.name,
					avatarUrl: member.profilePicUrl
				})),
				messages: chat.messages.map(message => ({
					id: message.id,
					text: message.text,
					createdAt: message.createdAt,
					sender: {
						id: message.sender.id,
						name: message.sender.name,
						avatarUrl: message.sender.profilePicUrl
					}
				}))
			}
		});
	}
}

