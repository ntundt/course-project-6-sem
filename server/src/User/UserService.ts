import UserBlockedError from './Errors/UserBlockedError';

export default class UserService {
	private redis: any;
	
	constructor(redis: any) {
		this.redis = redis;
	}

	public async isUserBlocked(userId: number): Promise<boolean> {
		const blockedUntil = await this.redis.get(`user:${userId}:blockedUntil`);
		console.log('blocked until: ', blockedUntil);
		if (blockedUntil) {
			return Date.now() < parseInt(blockedUntil);
		}
		return false;
	}

	public async throwIfBlocked(userId: number): Promise<void> {
		console.log('throw if blocked: ', userId);
		if (await this.isUserBlocked(userId)) {
			throw new UserBlockedError(userId);
		}
	}

	public async blockUser(userId: number): Promise<void> {
		await this.redis.set(`user:${userId}:blockedUntil`, Date.now() + 24 * 60 * 60 * 1000 * 7);
	}

	public async unblockUser(userId: number): Promise<void> {
		await this.redis.del(`user:${userId}:blockedUntil`);
	}
}
