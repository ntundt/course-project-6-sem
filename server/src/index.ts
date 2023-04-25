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
import { Report } from './Reports/Report';
import ReportsController from './Reports/ReportsController';

const data = new DataSource({
	type: 'mysql',
	...config.typeorm,
	entities: [
		User,
		Chat,
		Message,
		Attachment,
		Report,
	],
});


const app: express.Application = createExpressServer({
	controllers: [
		MessagesController,
		ChatsController,
		AuthController,
		AttachmentsController,
		UsersController,
		ReportsController,
	],
	authorizationChecker: (action: Action, roles: string[]) => new Promise<boolean>((resolve, reject) => {
		passport.authenticate('jwt', (err, user) => {
			if (err) {
				return reject(err);
			}
			if (roles.indexOf('admin') !== -1 && !user.isModerator) {
				return resolve(false);
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
})();

console.log('Server started');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/' + config.server.upload_url, express.static(config.server.upload_dir));

app.listen(3000);
