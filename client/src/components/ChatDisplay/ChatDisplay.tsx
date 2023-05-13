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

import { showMembersModal } from '../../features/reducers/chatMembersSlice';
import { showChatSettingsModal } from '../../features/reducers/chatSettingsSlice';
import classes from '../Common/classesString';

export default function ChatDisplay() {	
	const dispatch = useDispatch<AppDispatch>();

	const chatId = useSelector((state: any) => state.chatsList.selectedChatId);
	const chatName = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === state.chatsList.selectedChatId)?.name);
	const isPrivate = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === state.chatsList.selectedChatId)?.type !== 'group');
	const avatarUrl = useSelector((state: any) => getAvatarUrl(state.chatsList.chats.find((chat: any) => chat.id === state.chatsList.selectedChatId)));
	const membersCount = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === state.chatsList.selectedChatId)?.membersCount);
	const creatorId = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === state.chatsList.selectedChatId)?.creatorId);

	const currentUserId = useSelector((state: any) => state.auth.userId);

	const openChatMembersModal = () => {
		dispatch(showMembersModal({ chatId }));
	}

	const openChatSettingsModal = () => {
		dispatch(showChatSettingsModal({ chatId }));
	}

	return (<>
			<div className={['ChatDisplay col-8', chatId ? '' : 'd-none'].join(' ')}>
				<div className="ChatDisplay-header">
					<div className="ChatDisplay-chat-info-container">
						<div className="ChatDisplay-avatar-container">
							<Avatar
								image={avatarUrl}
								isPrivate={isPrivate} />
						</div>
						<div className="ChatDisplay-chat-name-container">
							<div className="ChatDisplay-chat-name">
								{chatName}
							</div>
							<div className="ChatDisplay-chat-description">
								<small>
									{isPrivate ? 'Private chat' : 
										<a href="#" onClick={openChatMembersModal}>{membersCount} member(s)</a>}
								</small>
							</div>
						</div>
					</div>
					<div className="ChatDisplay-chat-control-button-container">
						<button 
							className={classes({
								"ChatDisplay-chat-control-button": true,
								'd-none': currentUserId !== creatorId,
							})}
							onClick={openChatSettingsModal}>
							<FontAwesomeIcon icon={faEllipsisVertical} />
						</button>
					</div>
				</div>
				<MessagesList />
				<MessageEditor />
			</div>
			<div className={['col-8', 'ChatDisplay-not-selected-placeholder-container', chatId ? 'd-none' : ''].join(' ')}>
				<div className="badge rounded-pill bg-primary ChatDisplay-not-selected-placeholder">
					Select a chat to start messaging
				</div>
			</div>
		</>
	);
}