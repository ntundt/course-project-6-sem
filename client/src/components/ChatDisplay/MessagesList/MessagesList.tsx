import { useEffect, useRef } from 'react';
import './MessagesList.css'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../features/store';
import { fetchMessageHistory } from '../../../features/apiCalls';
import Message from '../Message/Message';

export default function MessagesList(props: any) {
	const dispatch = useDispatch<AppDispatch>();
	const messagesListRef = useRef<HTMLDivElement>(null);
	const dummyDivRef = useRef<HTMLDivElement>(null);

	const scrollBottom = () => {
			dummyDivRef.current?.scrollIntoView({ behavior: 'smooth' });
	}

	const chat = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === state.chatsList.selectedChatId));
	const messagesLoading = useSelector((state: any) => state.chatDisplay.loading);
	const allMessagesLoaded = chat?.allMessagesLoaded;
	
	const messages = chat ? chat.messages : [];
	
	useEffect(() => {
		scrollBottom();
	}, [props.chatId, messages[0]?.id]);

	const loadMoreMessages = () => {
		dispatch(fetchMessageHistory(chat?.id, messages.length, 20));
	}

	useEffect(() => {
		if (allMessagesLoaded) return;
		scrollBottom();
		if (messagesListRef.current?.scrollTop === 0 && !messagesLoading) {
			loadMoreMessages();
		}
	});

	const onScroll = (e: any) => {
		if (allMessagesLoaded) return;
		if (e.target.scrollTop === 0 && !messagesLoading) {
			loadMoreMessages();
		}
	}

	return (
		<div onScroll={onScroll} ref={messagesListRef} className='MessagesList'>
			<div className="MessagesList-scrollable">
				{
					[...messages].reverse().map((message: any) => {
						return (
							<Message
								key={chat.id + ' ' + message.id}
								message={message}
							/>
						);
					})
				}
				<div ref={dummyDivRef} className='MessagesList-dummy-div'/>
			</div>
		</div>
	);
}
