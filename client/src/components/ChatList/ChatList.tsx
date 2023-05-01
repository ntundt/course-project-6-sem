import './ChatList.css';

import ChatEntry from './ChatEntry/ChatEntry';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatList } from '../../features/apiCalls';
import { AppDispatch } from '../../features/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { showViewModal } from '../../features/reducers/reportsSlice';

export default function ChatList() {
	const dispatch = useDispatch<AppDispatch>();

	const chats = useSelector((state: any) => state.chatsList.chats);
	const selectedChatId = useSelector((state: any) => state.chatsList.selectedChatId);
	const auth = useSelector((state: any) => state.auth);

	const userIsAdmin = useSelector((state: any) => state.auth.isAdmin);

	useEffect(() => {
		dispatch(fetchChatList());
	}, [auth]);

	const onReportsViewModalOpen = () => {
		dispatch(showViewModal({}));
	};

	return (
		<div className="ChatList col-4">
			<div className='ChatList-header'>
				<button className='ChatList-seamless-button'>
					<FontAwesomeIcon
						icon={faUserPlus}
						color='#007bff'
						fontSize='1rem'
					/>
				</button>
				{	userIsAdmin &&
					<button className='ChatList-seamless-button'
						onClick={onReportsViewModalOpen}>
						<FontAwesomeIcon
							icon={faFlag}
							color='#007bff'
							fontSize='1rem'
						/>
					</button>
				}
			</div>
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