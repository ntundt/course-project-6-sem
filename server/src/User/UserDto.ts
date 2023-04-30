import { User } from './User';

export default class UserDto {
	public id: number;
	public email: string;
	public name: string;
	public username: string;
	public avatar: string;
	public createdAt: Date;
	public updatedAt: Date;
	public blockedTo: Date;
	public blockedReason: string;
	public isAdmin: boolean;
	
	public constructor(user: User) {
		this.id = user.id;
		this.email = user.email;
		this.name = user.name;
		this.username = user.username;
		this.avatar = user.profilePicUrl;
		this.createdAt = user.createdAt;
		this.updatedAt = user.updatedAt;
		this.blockedTo = user.blockedTo;
		this.blockedReason = user.blockedReason;
		this.isAdmin = user.isAdmin;
	}
}
