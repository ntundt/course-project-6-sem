import { EntityManager } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Report } from '../Report';
import { User, userIsBlocked } from '../../User/User';
import ReportDto from '../ReportDto';
import { HttpError } from 'routing-controllers';
import { Message } from '../../Messages/Message';

export class CreateReportCommand {
	public authorId: number;
	public chatId: number;
	public messageId?: number;
	public userId: number;
	public reason: string;
}

export class CreateReportCommandHandler extends CommandHandlerBase<CreateReportCommand, ReportDto> {
	constructor(private _entityManager: EntityManager) {
		super(_entityManager);
	}

	public async handle(command: CreateReportCommand): Promise<ReportDto> {
		const user = await this._entityManager.findOneBy(User, {
			id: command.userId
		});

		if (!user) {
			throw new HttpError(404, 'User not found');
		}

		if (userIsBlocked(user)) {
			throw new HttpError(409, 'User is blocked');
		}

		if (command.messageId) {
 			const message = await this._entityManager.findOneBy(Message, {
				id: command.messageId,
				destinationChatId: command.chatId,
			});
			if (!message) {
				throw new HttpError(404, 'Message not found');
			}
		}

		const report = new Report();

		report.userId = command.userId;
		report.authorId = command.authorId;
		report.reason = command.reason;
		report.messageId = command.messageId;

		const savedReport = await this._entityManager.save(report);

		return new ReportDto(savedReport);
	}
}