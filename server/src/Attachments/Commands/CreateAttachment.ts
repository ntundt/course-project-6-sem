import { EntityManager, Repository } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import AttachmentType from '../AttachmentType.enum';
import { Attachment, getAttachmentPath } from '../Attachment';
import * as fs from 'fs/promises';
import * as config from '../../config.json';
import { HttpError } from 'routing-controllers';

export class CreateAttachmentCommand {
	public creatorId: number;
	public filename: string;
	public type: AttachmentType;
	public file: Express.Multer.File;
}

export class CreateAttachmentCommandHandler extends CommandHandlerBase<CreateAttachmentCommand, Attachment> {
	private attachmentRepository: Repository<Attachment>;
	
	public constructor(entityManager: EntityManager) {
		super(entityManager);
	
		this.attachmentRepository = entityManager.getRepository(Attachment);
	}

	private async saveFile(file: Express.Multer.File, fileEntity: Attachment): Promise<string> {
		const path = getAttachmentPath(fileEntity);
		
		await fs.writeFile(path, file.buffer);

		return path;
	}

	public async handle(command: CreateAttachmentCommand): Promise<Attachment> {
		try {
			return await this._em.transaction(async tem => {
				let attachment = new Attachment;
				
				attachment.uploaderId = command.creatorId;
				attachment.filename = command.filename;
				attachment.type = command.type as AttachmentType;

				const attachmentEntity = await tem.save(attachment);

				const path = await this.saveFile(command.file, attachmentEntity);

				return attachmentEntity;
			});
		} catch (e) {
			console.log(e);
			throw new HttpError(500, 'Error while saving file');
		}
	}
}