import initialState from '../initialState';

const chatSelected = (state: any, action: any) => {
	const newState = { 
		...state,
		selectedChatId: action.payload,
	};
	return newState;
};

const chatAdded = (state: any, action: any) => {
	const newState = {
		...state,
		chats: [...state.chats, action.payload],
	};
	return newState;
};

const chatUpdated = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chatsList.chats.map((chat: any) => {
			if (chat.id === action.payload.id) {
				return { ...chat, ...action.payload };
			}
			return chat;
		}),
	};					
	return newState;
};

const fetchPending = (state: any, action: any) => {
	const newState = {
		...state,
		loading: true,
	};
	return newState;
}

const fetchFulfilled = (state: any, action: any) => {
	console.log('fetchFulfilled', action.payload);

	const newState = {
		...state,
		loading: false,
		chats: action.payload,
	};
	return newState;
}

const fetchRejected = (state: any, action: any) => {
	const newState = {
		...state,
		loading: false,
		error: action.payload,
	};
	return newState;
}

const fetchChatMessagesPending = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chats.map((chat: any) => {
			if (chat.id === action.payload) {
				return { ...chat, loading: true };
			}
			return chat;
		}),
	};
	return newState;
}

const fetchChatMessagesFulfilled = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chats.map((chat: any) => {
			if (chat.id === action.payload.chatId) {
				return {
					...chat, 
					loading: false, 
					messages: [
						...chat.messages,
						...action.payload.messages
					].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
					allMessagesLoaded: action.payload.messages.length === 0,
				};
			}
			return chat;
		}),
	};
	return newState;
}

const fetchChatMessagesRejected = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chats.map((chat: any) => {
			if (chat.id === action.payload) {
				return { ...chat, loading: false, error: action.payload };
			}
			return chat;
		}),
	};
	return newState;
}

const messageAdded = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chats.map((chat: any) => {
			if (chat.id === action.payload.chatId) {
				return {
					...chat,
					messages: [action.payload.message, ...chat.messages]
				};
			}
			return chat;
		}),
	};
	return newState;
}

const messageEditorTextChanged = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chats.map((chat: any) => {
			if (chat.id === action.payload.chatId) {
				return {
					...chat,
					messageEditorText: action.payload.text,
				};
			}
			return chat;
		}),
	};
	return newState;
}

const messageReceived = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chats.map((chat: any) => {
			if (chat.id === action.payload.chatId) {
				return {
					...chat,
					messages: [action.payload, ...chat.messages],
				};
			}
			return chat;
		}),
	};
	return newState;
}

const messageSendFullfilled = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chats.map((chat: any) => {
			if (chat.id === action.payload.chatId) {
				return {
					...chat,
					messageEditorText: '',
					attachments: [],
				};
			}
			return chat;
		}),
	};
	return newState;
}

const messageRead = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chats.map((chat: any) => {
			if (chat.id === action.payload.chatId) {
				return {
					...chat,
					messages: chat.messages.map((message: any) => {
						if (message.id === action.payload.messageId) {
							return {
								...message,
								read: true,
							};
						}
						return message;
					}),
				};
			}
			return chat;
		}),
	};
	return newState;
}

const attachmentsUploadPending = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chats.map((chat: any) => {
			if (chat.id === action.payload.chatId) {
				return {
					...chat,
					attachments: chat.attachments ? [
						...chat.attachments,
						...action.payload.files.map((file: any) => ({
							...file,
							loading: true,
						})),
					] : action.payload.files.map((file: any) => ({
						...file,
						loading: true,
					})),
				};
			}
			return chat;
		}),
	};
	return newState;
}

const attachmentsUploadFulfilledSingle = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chats.map((chat: any) => {
			if (chat.id === action.payload.chatId) {
				return {
					...chat,
					attachments: chat.attachments.map((attachment: any) => {
						if (attachment.fileId === action.payload.fileId) {
							return {
								...attachment,
								attachment: action.payload.attachment,
								loading: false,
							};
						}
						return attachment;
					}),
				}
			}
			return chat;
		})
	};
	return newState;
}

const removeAttachment = (state: any, action: any) => {
	const newState = {
		...state,
		chats: state.chats.map((chat: any) => {
			if (chat.id === action.payload.chatId) {
				return {
					...chat,
					attachments: chat.attachments.filter((attachment: any) => attachment.fileId !== action.payload.fileId),
				};
			}
			return chat;
		}),
	};
	return newState;
}


export default function chatsListReducer(state = initialState.chatsList, action: any) {
	const { type } = action;
	switch (type) {
		case 'chatsList/chatSelected':
			return chatSelected(state, action);
		case 'chatsList/chatAdded':
			return chatAdded(state, action);
		case 'chatsList/chatUpdated':
			return chatUpdated(state, action);
		case 'chatsList/fetch/pending':
			return fetchPending(state, action);
		case 'chatsList/fetch/fulfilled':
			return fetchFulfilled(state, action);
		case 'chatsList/fetch/rejected':
			return fetchRejected(state, action);
		case 'chatsList/fetchChatMessages/pending':
			return fetchChatMessagesPending(state, action);
		case 'chatsList/fetchChatMessages/fulfilled':
			return fetchChatMessagesFulfilled(state, action);
		case 'chatsList/fetchChatMessages/rejected':
			return fetchChatMessagesRejected(state, action);
		case 'chatsList/messageAdded':
			return messageAdded(state, action);
		case 'chatsList/messageEditorTextChanged':
			return messageEditorTextChanged(state, action);
		case 'chatsList/messageReceived':
			return messageReceived(state, action);
		case 'chatsList/messageSend/fulfilled':
			return messageSendFullfilled(state, action);
		case 'chatsList/messageRead':
			return messageRead(state, action);
		case 'chatsList/attachmentsUpload/pending':
			return attachmentsUploadPending(state, action);
		case 'chatsList/attachmentsUpload/fulfilledSingle':
			return attachmentsUploadFulfilledSingle(state, action);
		case 'chatsList/removeAttachment':
			return removeAttachment(state, action);
	}
	return state;
}
