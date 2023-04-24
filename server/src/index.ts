import 'reflect-metadata';
import express from 'express';
import { DataSource, Repository } from 'typeorm';
import { User } from './User/User';
import { Chat } from './Chats/Chat';
import { Message } from './Messages/Message'
import { Attachment } from './Attachments/Attachment';
import passport, { Passport } from 'passport';
import crypto from 'crypto';
import { Action, createExpressServer } from 'routing-controllers';
import MessagesController from './Messages/MessagesController';
import ChatsController from './Chats/ChatsController';
import Strategy from './Auth/AuthInit';
import AuthController from './Auth/AuthController';
import Mediator from './Common/CommandMediator';
import * as config from './config.json';
import AttachmentsController from './Attachments/AttachmentsController';
import UsersController from './User/UsersController';

const data = new DataSource({
	type: 'mysql',
	...config.typeorm,
	entities: [
		User,
		Chat,
		Message,
		Attachment,
	]
});


const app: express.Application = createExpressServer({
	controllers: [
		MessagesController,
		ChatsController,
		AuthController,
		AttachmentsController,
		UsersController,
	],
	authorizationChecker: (action: Action, roles: string[]) => new Promise<boolean>((resolve, reject) => {
		passport.authenticate('jwt', (err, user) => {
			if (err) {
				return reject(err);
			}
			if (!user) {
				return resolve(false);
			}
			action.request.user = user;
			return resolve(true);
		})(action.request, action.response, action.next)
	}),
	currentUserChecker: (action: Action) => action.request.user,
});

passport.use(Strategy);

(async function main() {
	await data.initialize();
	Mediator.instance.setEntityManager(data.createEntityManager());
	/*await data.getRepository(User).query(`
		drop trigger if exists user_add_destination;
		delimiter //
		create trigger user_add_destination
			after insert on user
			for each row
		begin
			insert into message_destination 
				(id, object_id, object_type) values (default, new.id, 'user');
		end//
		delimiter ;
	`)*/
	let user = new User;
	user.name = 'test';
	user.email = 'nikita.tihonovich@gmail.com';
	user.salt = crypto.randomBytes(16).toString('hex');
	user.passwordHash = crypto.createHash('sha256').update('test' + user.salt).digest('hex');
	user.profilePicUrl = 'https://0.gravatar.com/avatar/0696f5e328e7d57002ab70778467e942';
	
	
	let groupChat = new Chat;
	groupChat.creator = user;
	groupChat.members = [user];
	
	//await data.getRepository(GroupChat).save(groupChat);

	let message = new Message;
	message.text = 'test';
	message.sender = user;
	message.destinationChatId = groupChat.id;
	
	groupChat.messages = [message];
})();

console.log('Server started');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/' + config.server.upload_url, express.static(config.server.upload_dir));

app.listen(3000);
