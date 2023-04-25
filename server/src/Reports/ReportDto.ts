import MessageDto from '../Messages/MessageDto';
import { Report } from './Report';

export default class ReportDto {
	public id: number;
	public userId: number;
	public authorId: number;
	public reason: string;
	public createdAt: Date;
	public isResolved: boolean;
	public resolvedAt: Date;
	public message?: MessageDto;

	constructor(report: Report) {
		this.id = report.id;
		this.userId = report.userId;
		this.authorId = report.authorId;
		this.reason = report.reason;
		this.createdAt = report.createdAt;
		this.isResolved = report.isResolved;
		this.resolvedAt = report.resolvedAt;
		this.message = report.message ? new MessageDto(report.message) : null;
	}
}