import { Authorized, Controller, CurrentUser, HttpError, Post, UploadedFile } from 'routing-controllers';
import Mediator from '../Common/CommandMediator';
import { CreateAttachmentCommand } from './Commands/CreateAttachment';
import { Attachment, getAttachmentUrl } from './Attachment';
import multer from 'multer';
import AttachmentChecker from './AttachmentChecker';
import AttachmentDto from './AttachmentDto';
import TokenPayload from '../Auth/TokenPayload';

@Controller()
export default class AttachmentsController {
	private static readonly fileUploadOptions = {
		limits: {
			fileSize: 1024 * 1024 * 5,
			files: 1,
		},
		storage: multer.memoryStorage(),
	};
	
	@Authorized()
	@Post('/api/attachments')
	public async createAttachment(
		@UploadedFile('file', {
			options: AttachmentsController.fileUploadOptions,
			required: true 
		}) file: Express.Multer.File,
		@CurrentUser({ required: true }) user: TokenPayload,
	) {
		if (!AttachmentChecker.checkAttachmentAllowed(file)) {
			throw new HttpError(422, 'Unprocessable entity');
		}

		const command = new CreateAttachmentCommand();
		command.creatorId = user.userId;
		command.filename = file.originalname;
		command.file = file;
		command.type = AttachmentChecker.getAttachmentType(file);

		const result = (await Mediator.instance.sendCommand(command)) as Attachment;
		
		const dto = new AttachmentDto();
		dto.id = result.id;
		dto.filename = result.filename;
		dto.type = result.type;
		dto.url = getAttachmentUrl(result);

		return dto;
	}
}