import { Attachment, getAttachmentUrl } from './Attachment';

export default class AttachmentDto {
	// uuid
	public id: string;
	
	// original filename
	public filename: string; 
	
	public type: string;

	// url to download
	public url: string;

	public width?: number;

	public height?: number;

	constructor(attachment: Attachment) {
		this.id = attachment.id;
		this.filename = attachment.filename;
		this.type = attachment.type;
		this.url = getAttachmentUrl(attachment);
		this.width = attachment.width;
		this.height = attachment.height;
	}
}