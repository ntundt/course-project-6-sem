import './MessageEditor.css';

import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../features/store';
import { sendMessage } from '../../../features/apiCalls';
import { useHotkeys } from 'react-hotkeys-hook';

export default function MessageEditor(props: any) {
	const dispatch = useDispatch<AppDispatch>();

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
			attachments: [],
		}));
	}

	useHotkeys('ctrl+enter', messageSend, { enableOnFormTags: true });

	return (
		<div className="MessageEditor">
			<div className="MessageEditor-attachments-view">
				
			</div>
			<div className="MessageEditor-message-editor">
				<div className="MessageEditor-attachment-button-container">
					<button className="MessageEditor-attachment-button MessageEditor-seamless-button">
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
