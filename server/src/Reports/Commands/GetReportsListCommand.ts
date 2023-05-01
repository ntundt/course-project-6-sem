import { EntityManager } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import ReportDto from '../ReportDto';
import { Report } from '../Report';

export class GetReportsListCommand { }

export class GetReportsListCommandHandler extends CommandHandlerBase<GetReportsListCommand, ReportDto[]> {
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	}

	public async handle(command: GetReportsListCommand): Promise<ReportDto[]> {
		const reports = await this._em.find(Report, {
			where: {
				isResolved: false
			},
			order: {
				createdAt: 'ASC'
			},
			relations: ['message'],
		});

		return reports.map(report => new ReportDto(report));
	}
}
