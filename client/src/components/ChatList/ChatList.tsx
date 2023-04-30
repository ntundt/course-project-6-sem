import './ChatList.css';

import ChatEntry from './ChatEntry/ChatEntry';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatList } from '../../features/apiCalls';
import { AppDispatch } from '../../features/store';

export default function ChatList() {
	const dispatch = useDispatch<AppDispatch>();

	const chats = useSelector((state: any) => state.chatsList.chats);
	const selectedChatId = useSelector((state: any) => state.chatsList.selectedChatId);
	const auth = useSelector((state: any) => state.auth);

	useEffect(() => {
		dispatch(fetchChatList());
	}, [auth]);

	return (
		<div className="ChatList col-4">
			{chats.map((chat: any) => {
				const lastMessage = chat.messages[chat.messages.length - 1];
				return <ChatEntry
					key={chat.id}
					chatId={chat.id}
				/>
			})}
		</div>
	);
}