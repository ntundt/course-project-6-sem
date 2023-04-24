import { EntityManager } from 'typeorm';
import { Chat } from '../Chats/Chat';

export default class MessagesService {
	constructor(private readonly entityManager: EntityManager) {}

	public async userIsChatMember(userId: number, chatId: number): Promise<boolean> {
		return this.entityManager.getRepository(Chat).exist({
			where: { id: chatId, members: [{ id: userId }]}
		});
	}
}
