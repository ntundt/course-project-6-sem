import './MessageEditor.css';

import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../features/store';
import { sendMessage, uploadAttachments } from '../../../features/apiCalls';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRef } from 'react';
import AttachmentCard from './AttachmentCard/AttachmentCard';

export default function MessageEditor(props: any) {
	const dispatch = useDispatch<AppDispatch>();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const maxTextareaHeight = 115;

	const chat = useSelector((state: any) => state.chatsList.chats?.find((chat: any) => chat.id === state.chatsList.selectedChatId));
	const messageText = useSelector((state: any) => state.chatsList.chats?.find((chat: any) => chat.id === state.chatsList.selectedChatId)?.messageEditorText) ?? '';

	const onMessageInput = (event: any) => {
		event.target.style.height = 'inherit';
		event.target.style.height = `${Math.min(maxTextareaHeight, event.target.scrollHeight)}px`;

		dispatch({
			type: 'chatsList/messageEditorTextChanged',
			payload: {
				chatId: chat.id,
				text: event.target.value,
			}
		});
	}

	const messageSend = () => {
		dispatch(sendMessage(chat.id, {
			text: messageText,
			attachments: chat.attachments?.map((attachment: any) => attachment.attachment.id),
		}));
	}

	useHotkeys('ctrl+enter', messageSend, { enableOnFormTags: true });

	const addAttachments = () => {
		fileInputRef.current?.click();
	}

	const onFileInput = (event: any) => {
		const files = Array.from(event.target.files) as File[];
		if (!files) return;
		dispatch(uploadAttachments(chat.id, files));
	}

	return (
		<div className="MessageEditor">
			{chat?.attachments?.length > 0 &&
				<div className="MessageEditor-attachments-view">
					{chat?.attachments?.map((attachment: any) => {
						return <AttachmentCard
							key={attachment.id}
							chatId={chat.id}
							fileId={attachment.fileId}
							file={attachment.file}
						/>
					})}
				</div>
			}
			<div className="MessageEditor-message-editor">
				<div className="MessageEditor-attachment-button-container">
					<input
						ref={fileInputRef}
						type="file" multiple hidden
						onChange={onFileInput}
						accept='image/*,video/*,audio/*'
					/>
					<button className="MessageEditor-attachment-button MessageEditor-seamless-button"
						onClick={addAttachments}>
						<FontAwesomeIcon icon={faPaperclip} />
					</button>
				</div>
				<div className="MessageEditor-message-input-wrapper">
					<textarea
						className="MessageEditor-message-input"
						placeholder="Type a message"
						value={messageText}
						rows={1}
						onChange={onMessageInput} />
				</div>
				<div className="MessageEditor-send-button-container">
					<button className="MessageEditor-send-button MessageEditor-seamless-button"
						onClick={messageSend}>
						{/* faPaperPlaneTop definition is missing for some reason */}
						<FontAwesomeIcon icon={faPaperPlane} />
					</button>
				</div>
			</div>
		</div>
	);
}
