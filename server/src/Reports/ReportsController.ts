import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { CreateReportCommand } from './Commands/CreateReportCommand';
import TokenPayload from '../Auth/TokenPayload';
import Mediator from '../Common/CommandMediator';
import ReportDto from './ReportDto';
import { ProcessReportCommand } from './Commands/ProcessReportCommand';
import { GetReportsListCommand } from './Commands/GetReportsListCommand';

@JsonController()
export default class ReportsController {
	@Authorized()
	@Post('/api/users/:userId/reports')
	public async createReport(
		@Param('userId') userId: number,
		@Body() command: CreateReportCommand,
		@CurrentUser() user: TokenPayload,
	): Promise<ReportDto> {
		command.userId = userId;
		command.authorId = user.userId;

		return await Mediator.instance.sendCommand(command);
	}

	@Authorized([ 'admin' ])
	@Put('/api/users/:userId/reports/:reportId')
	public async processReport(
		@Body() command: ProcessReportCommand,
		@CurrentUser() user: TokenPayload,
	): Promise<ReportDto> {
		command.resolverId = user.userId;

		return await Mediator.instance.sendCommand(command);
	}

	@Authorized([ 'admin' ])
	@Get('/api/reports')
	public async getReports(
		@CurrentUser() user: TokenPayload,
	): Promise<ReportDto[]> {
		const getReportsListCommand = new GetReportsListCommand();

		return await Mediator.instance.sendCommand(getReportsListCommand);
	}
		
}