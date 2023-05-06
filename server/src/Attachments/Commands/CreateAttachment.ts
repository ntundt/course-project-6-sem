import { EntityManager, Repository } from 'typeorm';
import CommandHandlerBase from '../../Common/CommandHandlerBase';
import AttachmentType from '../AttachmentType.enum';
import { Attachment, getAttachmentPath } from '../Attachment';
import fs from 'fs/promises';
const config = JSON.parse(await fs.readFile('./src/config.json', 'utf-8'));
import { HttpError } from 'routing-controllers';
import ffmpeg from 'fluent-ffmpeg';
import * as Stream from 'stream';

import * as child_process from 'child_process';

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

	private getMediaDimensions(buffer: Buffer, type: AttachmentType): Promise<{ width: number, height: number }> {
		return new Promise((resolve, reject) => {
			const readableStream = new Stream.Readable();
			readableStream.push(buffer);
			readableStream.push(null);

			ffmpeg.setFfmpegPath(config.envionment.ffmpeg_path);
			ffmpeg.setFfprobePath(config.envionment.ffprobe_path);

			if (type === AttachmentType.Animation) {
				const command = child_process.spawn(config.envionment.ffprobe_path, [
					'-v', 'error',
					'-show_entries', 'stream=width,height',
					'-of', 'csv=p=0:s=x',
					'-'
				]);
				command.stdout.on('data', (data) => {
					const dimensions = data.toString().split('x');
					resolve({
						width: parseInt(dimensions[0]),
						height: parseInt(dimensions[1])
					});
				});
				command.stdin.write(buffer);
				command.stdin.end();
				return;
			}

			ffmpeg(readableStream)
				.ffprobe((err, data) => {
					if (err) {
						reject(err);
					}
					try {
						resolve({
							width: data.streams[0].width,
							height: data.streams[0].height
						});
					} catch (e) {
						reject(e);
					}
				});
			
		});
	}

	public async handle(command: CreateAttachmentCommand): Promise<Attachment> {
		try {
			return await this._em.transaction(async tem => {
				let attachment = new Attachment;
				
				attachment.uploaderId = command.creatorId;
				attachment.filename = command.filename;
				attachment.type = command.type as AttachmentType;

				if (attachment.type === AttachmentType.Image || attachment.type === AttachmentType.Video
					|| attachment.type === AttachmentType.Animation) {
					const dimensions = await this.getMediaDimensions(command.file.buffer, attachment.type);
					attachment.width = dimensions.width;
					attachment.height = dimensions.height;
				}

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