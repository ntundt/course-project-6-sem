import AttachmentType from './AttachmentType.enum';
import * as config from '../config.json';

export default class AttachmentChecker {
	private static readonly magicNumbers = {
		jpg: Buffer.from([0xff, 0xd8, 0xff]),
		jpeg: Buffer.from([0xff, 0xd8, 0xff]),
		png: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		gif: Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]),
		mp4: Buffer.from([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]),
		mp3: Buffer.from([0x49, 0x44, 0x33]),
		webm: Buffer.from([0x1a, 0x45, 0xdf, 0xa3]),
		webp: Buffer.from([0x52, 0x49, 0x46, 0x46]),
	};

	private static get allowedExtensions() {
		return Object.keys(AttachmentChecker.magicNumbers);
	}

	private static get maxMagicNumberLength(): number {
		return Math.max(...Object.values(AttachmentChecker.magicNumbers)
			.map((magicNumber) => magicNumber.length));
	}
	
	private static checkMagicNumber(fileBuffer: Buffer, magicNumber: Buffer): boolean {
		return fileBuffer.subarray(0, magicNumber.length).equals(magicNumber);
	}

	public static checkAttachmentAllowed(file: Express.Multer.File): boolean {
		const fileBuffer = file.buffer.subarray(0, AttachmentChecker.maxMagicNumberLength);
		
		const extensionAllowed = AttachmentChecker.allowedExtensions
			.includes(file.originalname.toLowerCase().split('.').pop());

		const magicNumberAllowed = Object.values(AttachmentChecker.magicNumbers)
			.some((magicNumber) => AttachmentChecker.checkMagicNumber(fileBuffer, magicNumber));

		console.log(extensionAllowed, magicNumberAllowed);

		return extensionAllowed && magicNumberAllowed;
	}

	public static getAttachmentType(file: Express.Multer.File): AttachmentType {
		const fileBuffer = file.buffer.subarray(0, AttachmentChecker.maxMagicNumberLength);

		const magicNumber = Object.entries(AttachmentChecker.magicNumbers)
			.find(([_, magicNumber]) => AttachmentChecker.checkMagicNumber(fileBuffer, magicNumber));

		if (!magicNumber) {
			throw new Error('Invalid file');
		}

		switch (magicNumber[0]) {
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'gif':
			case 'webp':
				return AttachmentType.Image;
			case 'mp4':
			case 'webm':
				return AttachmentType.Video;
			case 'mp3':
				return AttachmentType.Audio;
			default:
				return AttachmentType.Document;
		}
	}

	public static getAttachmentUrl(path: string): string {
		return `${config.server.host}/${config.server.upload_url}/${path.split('/').pop()}`;
	}
} 