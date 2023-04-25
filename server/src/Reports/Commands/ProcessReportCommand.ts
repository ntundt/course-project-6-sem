import { HttpError } from 'routing-controllers';
import ReportDto from '../ReportDto';
import { EntityManager } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import { Report } from '../Report';

export class ProcessReportCommand {
	public id: number;
	public resolverId: number;
	public approved: boolean;
	public reason?: string;
}

export class ProcessReportCommandHandler extends CommandHandlerBase<ProcessReportCommand, ReportDto>{
	constructor(entityMandger: EntityManager) {
		super(entityMandger);
	}

	public async handle(command: ProcessReportCommand): Promise<ReportDto> {
		const report = await this._em.findOneBy(Report, {
			id: command.id
		});

		if (!report) {
			throw new HttpError(404, 'Report not found');
		}

		if (report.isResolved) {
			throw new HttpError(409, 'Report is already resolved');
		}

		report.isResolved = true;
		report.resolvedAt = new Date();

		if (command.approved) {
			report.user.blockedTo = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
			report.user.blockedReason = command.reason ?? report.reason;
			report.user.blockedById = command.resolverId;
		}

		await this._em.save(report);

		return new ReportDto(report);
	}
}
