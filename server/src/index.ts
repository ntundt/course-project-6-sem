import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import { User } from './User/User';
import { Chat } from './Chats/Chat';
import { Message } from './Messages/Message'
import { Attachment } from './Attachments/Attachment';
import passport from 'passport';
import { Action, createExpressServer } from 'routing-controllers';
import MessagesController from './Messages/MessagesController';
import ChatsController from './Chats/ChatsController';
import Strategy from './Auth/AuthInit';
import AuthController from './Auth/AuthController';
import Mediator from './Common/CommandMediator';
import fs from 'fs/promises';
const config = JSON.parse(await fs.readFile('./src/config.json', 'utf-8'));
import AttachmentsController from './Attachments/AttachmentsController';
import UsersController from './User/UsersController';
import { Report } from './Reports/Report';
import ReportsController from './Reports/ReportsController';
import { createServer as createHttpsServer } from 'https';
import { createServer as createHttpServer } from 'http';
import { Server } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import TokenPayload from './Auth/TokenPayload';
import NotificationService from './Common/NotificationService';
import { GetUserRoomsCommand, GetUserRoomsCommandResult } from './Common/Commands/GetUserRoomsCommand';
import { ErrorHandlerMiddleware } from './Common/ErrorHandlerMiddleware';
import { createClient } from 'redis';

console.log('Server started');

process.env.TZ = 'Europe/Minsk';
console.log('Timezone used ', process.env.TZ);

const app: express.Application = createExpressServer({
	controllers: [
		MessagesController,
		ChatsController,
		AuthController,
		AttachmentsController,
		UsersController,
		ReportsController,
	],
	cors: {
		origin: `${config.client.protocol}://${config.client.host}:${config.client.port}`,
		credentials: true,
	},
	authorizationChecker: (action: Action, roles: string[]) => new Promise<boolean>((resolve, reject) => {
		try {
			action.response.setHeader('Access-Control-Allow-Origin', `${config.client.protocol}://${config.client.host}:${config.client.port}`);
			action.response.setHeader('Access-Control-Allow-Headers', 'Authorization');
			action.response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
			action.response.setHeader('Access-Control-Allow-Credentials', 'true');
		} catch (e) { }

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

			Mediator.instance.getUserService().throwIfBlocked(user.userId).then(() => {
				action.request.user = user;
				resolve(true);
			}).catch(() => {
				resolve(false);
			});
		})(action.request, action.response, action.next)
	}),
	currentUserChecker: (action: Action) => action.request.user,
	middlewares: [
		ErrorHandlerMiddleware,
	],
	defaultErrorHandler: false,
});


app.all('*', (req, res, next) => {
	try {
		res.setHeader('Access-Control-Allow-Origin', `${config.client.protocol}://${config.client.host}:${config.client.port}`);
		res.setHeader('Access-Control-Allow-Headers', 'Authorization');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		res.setHeader('Access-Control-Allow-Credentials', 'true');
	} catch (e) { }
	
	next();
	
	if (res.statusCode === 404) {
		res.send('Custom error message');
	}
});

passport.use(Strategy);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/' + config.server.upload_url, express.static(config.server.upload_dir));

let httpServer;
if (config.server.protocol === 'https') {
	httpServer = createHttpsServer({
		key: await fs.readFile('../../key.pem'),
		cert: await fs.readFile('../../cert.pem'),
	}, app);
} else {
	httpServer = createHttpServer(app);
}

const io = new Server(httpServer, {
	cors: {
		origin: `${config.client.protocol}://${config.client.host}:${config.client.port}`,
		credentials: true,
	},
});

const notificationService = new NotificationService(io);
io.on('connection', async (socket) => {
	const token = socket.handshake.auth.token;

	if (!token) {
		console.log('Client does not have token, disconnecting');
		socket.disconnect();
		return;
	}

	try {
		const payload = jwt.verify(token, config.server.jwt_secret) as TokenPayload;
		console.log('Connected user: ', payload.userId);
		notificationService.registerSocket(payload.userId, socket);

		const command = new GetUserRoomsCommand();
		command.userId = payload.userId;

		const rooms = await Mediator.instance.sendCommand(command) as GetUserRoomsCommandResult;
		rooms.rooms.forEach(room => {
			notificationService.subscribe(payload.userId, room);
		});
	} catch (e) {
		console.error(e);
		console.log('Client has invalid token');
		socket.disconnect();
		return;
	}
});


(async function main() {
	const data = new DataSource({
		type: 'mysql',
		timezone: 'UTC',
		...config.typeorm,
		entities: [
			User,
			Chat,
			Message,
			Attachment,
			Report,
		],
	});
	await data.initialize();
	console.log('Database connected');

	const redis = createClient({
		url: config.redis.url,
		password: config.redis.password,
	});
	await redis.connect();
	console.log('Redis connected');

	Mediator.instance.setRedis(redis);
	Mediator.instance.setNotificationService(notificationService);
	Mediator.instance.setEntityManager(data.createEntityManager());
	Mediator.instance.initCommandHandlers();
	
	httpServer.listen(config.server.port);
	console.log(`Server listening port ${config.server.port}`);
})();

