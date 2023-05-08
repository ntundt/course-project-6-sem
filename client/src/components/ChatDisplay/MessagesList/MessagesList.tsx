import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './MessagesList.css'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../features/store';
import { fetchMessageHistory } from '../../../features/apiCalls';
import Message from '../Message/Message';

import InfiniteScroll from 'react-infinite-scroll-component';

export default function MessagesList(props: any) {
	const dispatch = useDispatch<AppDispatch>();
	const messagesListRef = useRef<HTMLDivElement>(null);
	const dummyDivRef = useRef<HTMLDivElement>(null);
	
	const loadMoreMessages = () => {
		dispatch(fetchMessageHistory(chatId, messages.length, 20));
	}
	
	const scrollBottom = () => {
			dummyDivRef.current?.scrollIntoView({ behavior: 'smooth' });
	}

	const chatId = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === state.chatsList.selectedChatId)?.id);
	const messagesLoading = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === state.chatsList.selectedChatId)?.loading);
	const messages = useSelector((state: any) => state.chatsList.chats.find((chat: any) => chat.id === state.chatsList.selectedChatId)?.messages);
	const firstMessage = useSelector(
		(state: any) => state.chatsList.chats.find((chat: any) => 
			chat.id === state.chatsList.selectedChatId)?.messages[messages?.length - 1]);
	const allMessagesLoaded = useSelector(
		(state: any) => state.chatsList.chats.find((chat: any) =>
			chat.id === state.chatsList.selectedChatId)?.allMessagesLoaded);
	const lastMessage = useSelector(
		(state: any) => state.chatsList.chats.find((chat: any) =>
			chat.id === state.chatsList.selectedChatId)?.messages[0]);

	let scrollBottomPos = useRef(0);

	useLayoutEffect(() => {
		if (messagesListRef.current && !messagesLoading) {
			messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight - scrollBottomPos.current;
		}
	}, [firstMessage]);

	const onScroll = (e: any) => {
		if (!messagesLoading) {
			scrollBottomPos.current = e.target.scrollHeight - e.target.scrollTop;
		}

		if (messagesLoading) return;
		if (allMessagesLoaded) return;
		if (e.target.scrollTop < 100) {
			loadMoreMessages();
		}
	}

	useEffect(() => {
		if (messagesLoading) return;
		if (allMessagesLoaded) return;
		if (messages?.length < 20) {
			loadMoreMessages();
		}
	});

	useEffect(() => {
		if (lastMessage) {
			scrollBottom();
		}
	}, [lastMessage]);

	return (
		<div onScroll={onScroll} ref={messagesListRef} className='MessagesList'>
			<div className="MessagesList-scrollable">
				{ messages &&
					[...messages].reverse().map((message: any) => {
						return (
							<Message
								key={chatId + ' ' + message.id}
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
