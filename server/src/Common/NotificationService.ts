import { Server, Socket } from "socket.io";

/**
 * A class that's responsible for sending notifications to the client.
 * It utilizes the socket.io library.
 */
export default class NotificationService {
	private io: Server;

	private sockets: { [userId: number]: Socket[] } = {};

	private getSockets(userId: number): Socket[] {
		return this.sockets[userId] || [];
	}

	private addSocket(userId: number, socket: Socket) {
		if (!this.sockets[userId]) {
			this.sockets[userId] = [];
		}
		this.sockets[userId].push(socket);
	}

	private removeSocket(userId: number, socket: Socket) {
		if (!this.sockets[userId]) {
			return;
		}
		this.sockets[userId] = this.sockets[userId].filter(s => s !== socket);
	}

	constructor(io: Server) {
		this.io = io;
	}

	/**
	 * Sends a notification to the client.
	 * @param objectType The type of the object that was changed.
	 * @param objectId The id of the object that was changed.
	 * @param event The name of the event to send.
	 * @param data The data to send.
	 */
	public send(roomName: string, event: string, data: any) {
		console.log(`Sending to ${roomName}:`, data);

		this.io.to(roomName).emit(event, data);
	}

	/**
	 * Subscribes the client to the specified object.
	 * @param objectType The type of the object to subscribe to.
	 * @param objectId The id of the object to subscribe to.
	 */
	public subscribe(userId: number, roomName: string) {
		this.getSockets(userId).forEach(socket => socket.join(roomName));
	}

	/**
	 * Unsubscribes the client from the specified object.
	 * @param objectType The type of the object to unsubscribe from.
	 * @param objectId The id of the object to unsubscribe from.
	 */
	public unsubscribe(userId: number, roomName: string) {
		this.getSockets(userId).forEach(socket => socket.leave(roomName));
	}

	/**
	 * Registers the socket for the specified user.
	 * @param userId The id of the user.
	 * @param socket The socket to register.
	 */
	public registerSocket(userId: number, socket: Socket) {
		this.addSocket(userId, socket);

		socket.on('disconnect', () => {
			console.log(`User ${userId} disconnected`);

			this.removeSocket(userId, socket);
		});
	}
}
