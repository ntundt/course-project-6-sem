import AttachmentType from './AttachmentType.enum';
import fs from 'fs/promises';	
const config = JSON.parse(await fs.readFile('./src/config.json', 'utf-8'));

import{ fileTypeFromBuffer } from 'file-type';

export default class AttachmentChecker {
	private static readonly allowedTypes = [
		'image/jpeg',
		'image/png',
		'image/gif',
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/vnd.ms-powerpoint',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		'video/webm',
		'video/mp4',
		'video/ogg',
		'audio/mpeg',
		'audio/ogg',
		'audio/wav',
		'audio/webm',
		'application/zip',
		'application/x-rar-compressed',
		'application/x-7z-compressed',
		'application/x-tar',
		'application/x-bzip',
		'application/x-bzip2',
	];

	public static async checkAttachmentAllowed(file: Express.Multer.File): Promise<boolean> {
		const type = await fileTypeFromBuffer(file.buffer);
		return AttachmentChecker.allowedTypes.includes(type.mime);
	}

	public static getAttachmentType(file: Express.Multer.File): AttachmentType {
		const type = file.mimetype;
		switch (type) {
			case 'image/jpeg':
			case 'image/png':
				return AttachmentType.Image;
			case 'video/webm':
			case 'video/mp4':
			case 'video/ogg':
				return AttachmentType.Video;
			case 'audio/mpeg':
			case 'audio/ogg':
			case 'audio/wav':
			case 'audio/webm':
				return AttachmentType.Audio;
			case 'image/gif':
				return AttachmentType.Animation;
			default:
				return AttachmentType.Document;
		}
	}

	public static getAttachmentUrl(path: string): string {
		return `${config.server.host}/${config.server.upload_url}/${path.split('/').pop()}`;
	}
} 