import React from 'react';
import './ChatEntry.css';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIconAsAvatar from '../../Common/FontAwesomeIconAsAvatar';
import TimeDisplay from '../../TimeDisplay/TimeDisplay';
import { chatSelected } from '../../../features/chatsListSlice';
import Avatar, { getAvatarUrl } from '../../Common/Avatar';

import config from '../../../config.json';
import { AppDispatch } from '../../../features/store';

export default function ChatEntry(props: any) {
	const dispatch = useDispatch<AppDispatch>();

	const chat = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === props.chatId));
	const chatName = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === props.chatId)?.name);
	const lastMessageText = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === props.chatId)?.messages[0]?.text);
	const lastMessageTime = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === props.chatId)?.messages[0]?.date);
	const chatCreatedAt = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === props.chatId)?.createdAt);
	const avatarUrl = useSelector((state: any) => getAvatarUrl(state.chatsList.chats.find((chat: any) => chat.id === props.chatId)));
	const isPrivate = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === props.chatId)?.type !== 'group');
	const isSelected = useSelector((state: any) => state.chatsList.selectedChatId === props.chatId);
	const read = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === props.chatId)?.messages[0]?.read);
	const chatTime = lastMessageTime ?? chatCreatedAt;
	
	console.log('chatTime', chatTime);

	const selectChat = () => {
		dispatch(chatSelected(props.chatId));
	};

	return (
		<div className={['ChatEntry', isSelected ? 'ChatEntry-selected' : ''].join(' ')}
			onClick={selectChat}>
			<div className='ChatEntry-image-container'>
				<Avatar
					image={avatarUrl}
					isPrivate={isPrivate}/>
			</div>
			<div className='ChatEntry-message-container'>
				<div className='ChatEntry-name-container'>
					<div className='ChatEntry-name'>{chatName}</div>
					<div className='ChatEntry-time'>
						<TimeDisplay time={chatTime} />
					</div>
				</div>
				<div className='ChatEntry-message'>
					<div className='ChatEntry-message-text'>
						{lastMessageText ?? <i>Empty</i>}
					</div>
					{!read && <div className='ChatEntry-unread-badge'></div>}
				</div>
			</div>
		</div>
	);
}