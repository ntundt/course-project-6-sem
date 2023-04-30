import './ChatDisplay.css';

import { useDispatch, useSelector } from 'react-redux';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MessageEditor from './MessageEditor/MessageEditor';
import MessagesList from './MessagesList/MessagesList';
import Avatar, { getAvatarUrl } from '../Common/Avatar';
import Message from './Message/Message';
import { useEffect, useRef } from 'react';
import { fetchChatMessages } from '../../features/chatsListSlice';
import { AppDispatch } from '../../features/store';
import debounce from 'lodash/debounce';

import config from '../../config.json';

export default function ChatDisplay() {
	const messagesListRef = useRef<HTMLDivElement>(null);
	
	const dispatch = useDispatch<AppDispatch>();

	const currentUserId = useSelector((state: any) => state.auth.id);
	const chat = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === state.chatsList.selectedChatId));
	const messages = chat?.messages;
	const avatarUrl = getAvatarUrl(chat);
	const isPrivate = chat?.type !== 'group';

	return (<>
			<div className={['ChatDisplay col-8', chat ? '' : 'd-none'].join(' ')}>
				<div className="ChatDisplay-header">
					<div className="ChatDisplay-chat-info-container">
						<div className="ChatDisplay-avatar-container">
							<Avatar
								image={avatarUrl}
								isPrivate={isPrivate} />
						</div>
						<div className="ChatDisplay-chat-name-container">
							<div className="ChatDisplay-chat-name">
								{chat?.name}
							</div>
							<div className="ChatDisplay-chat-description">
								<small>
									{isPrivate ? 'Private chat' : chat?.membersCount + ' members'}
								</small>
							</div>
						</div>
					</div>
					<div className="ChatDisplay-chat-control-button-container">
						<button className="ChatDisplay-chat-control-button">
							<FontAwesomeIcon icon={faEllipsisVertical} />
						</button>
					</div>
				</div>
				<MessagesList />
				<MessageEditor />
			</div>
			<div className={['col-8', 'ChatDisplay-not-selected-placeholder-container', chat ? 'd-none' : ''].join(' ')}>
				<div className="badge rounded-pill bg-primary ChatDisplay-not-selected-placeholder">
					Select a chat to start messaging
				</div>
			</div>
		</>
	);
}