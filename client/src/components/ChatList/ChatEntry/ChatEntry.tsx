import React from 'react';
import './ChatEntry.css';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIconAsAvatar from '../../Common/FontAwesomeIconAsAvatar';
import TimeDisplay from '../../TimeDipsplay/TimeDisplay';
import { chatSelected } from '../../../features/chatsListSlice';
import Avatar, { getAvatarUrl } from '../../Common/Avatar';

import config from '../../../config.json';
import { AppDispatch } from '../../../features/store';

export default function ChatEntry(props: any) {
	const dispatch = useDispatch<AppDispatch>();

	const chat = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === props.chatId));
	const isSelected = useSelector((state: any) => state.chatsList.selectedChatId === props.chatId);
	const isPrivate = props.type !== 'group';
	const avatarUrl = getAvatarUrl(chat);
	const lastMessage = chat.messages[0];
	const lastMessageText = lastMessage?.text;
	const chatTime = lastMessage?.date ?? chat.createdAt;
	
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
					<div className='ChatEntry-name'>{chat.name}</div>
					<div className='ChatEntry-time'>
						<TimeDisplay time={chatTime} />
					</div>
				</div>
				<div className='ChatEntry-message'>{lastMessageText ?? <i>Empty</i>}</div>
			</div>
		</div>
	);
}