import './ChatList.css';

import ChatEntry from './ChatEntry/ChatEntry';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatList } from '../../features/apiCalls';
import { AppDispatch } from '../../features/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faGear, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { showViewModal } from '../../features/reducers/reportsSlice';
import { showCreationModal } from '../../features/reducers/chatCreationSlice';
import { showSettingsModal } from '../../features/settingsSlice';

export default function ChatList() {
	const dispatch = useDispatch<AppDispatch>();

	const chats = useSelector((state: any) => state.chatsList.chats);
	const firstChat = useSelector((state: any) => state.chatsList.chats[0]);
	const selectedChatId = useSelector((state: any) => state.chatsList.selectedChatId);
	const auth = useSelector((state: any) => state.auth);

	const userIsAdmin = useSelector((state: any) => state.auth.isModerator);

	useEffect(() => {
		dispatch(fetchChatList());
	}, [auth]);

	const onReportsViewModalOpen = () => {
		dispatch(showViewModal({}));
	};

	const onChatCreateModalOpen = () => {
		dispatch(showCreationModal({}));
	};

	const onSettingsModalOpen = () => {
		dispatch(showSettingsModal());
	};

	return (
		<div className="ChatList col-4">
			<div className='ChatList-header'>
				<button className='ChatList-seamless-button'
					onClick={onSettingsModalOpen}>
					<FontAwesomeIcon
						icon={faGear}
						color='#007bff'
						fontSize='1rem'
					/>
				</button>
				<button className='ChatList-seamless-button'
					onClick={onChatCreateModalOpen}>
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
				<div className='ChatList-fill-rest-of-header'>
					<div className='ChatList-title'>Chats</div>
				</div>
			</div>
			<div className='ChatList-scrollable'>
				{chats.map((chat: any) => {
					return <ChatEntry
						key={chat.id}
						chatId={chat.id}
					/>
				})}
			</div>
		</div>
	);
}