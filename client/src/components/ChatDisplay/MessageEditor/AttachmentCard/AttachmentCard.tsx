import './AttachmentCard.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from '../../../Common/classesString';
import { faFile, faFileAudio, faFileImage, faFileVideo, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../features/store';

const isImage = (file: File) => {
	return file.type === 'image/png' || file.type === 'image/jpeg';
}

const isVideo = (file: File) => {
	return file.type === 'video/mp4';
}

const isAudio = (file: File) => {
	return file.type === 'audio/mpeg';
}

export default function AttachmentCard(props: any) {
	const dispatch = useDispatch<AppDispatch>();

	let icon;
	if (isImage(props.file)) {
		icon = faFileImage;
	} else if (isVideo(props.file)) {
		icon = faFileVideo;
	} else if (isAudio(props.file)) {
		icon = faFileAudio;
	} else {
		icon = faFile;
	}

	const removeAttachment = () => {
		dispatch({
			type: 'chatsList/removeAttachment',
			payload: {
				chatId: props.chatId,
				fileId: props.fileId,
			},
		});
	};

	return (
		<div className={classes({
			'AttachmentCard': true,
			'AttachmentCard-image': isImage(props.file),
			'AttachmentCard-video': isVideo(props.file),
			'AttachmentCard-audio': isAudio(props.file),
			'AttachmentCard-other': !isImage(props.file) && !isVideo(props.file) && !isAudio(props.file),
		})}>
			<button
				className='AttachmentCard-remove-button'
				onClick={removeAttachment}
			>
				<FontAwesomeIcon
					icon={faTimes}
					color='white'
					fontSize='1rem'
				/>
			</button>
			<FontAwesomeIcon
				icon={icon}
				color='white'
				fontSize='1.5rem'
			/>
			<div className='AttachmentCard-name'>
				{props.file.name}
			</div>
		</div>
	);
}
