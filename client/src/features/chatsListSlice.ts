import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from './apiCalls';

const initialState: any = {
	selectedChatId: null,
	chats: [],
	loading: false,
	error: null,
};

export const fetchChatList = createAsyncThunk('chatsList/fetch', async () => {
	const response = await axios.get('/chats');
	return response.data;
});

export const fetchChatMessages = createAsyncThunk('chatDisplay/fetch', async ({ chatId, offset, count }: any) => {
	const response = await axios.get(`/chats/${chatId}/messages?offset=${offset}&count=${count}`);
	return {
		chatId,
		messages: response.data,
	}
});

export const chatsListSlice = createSlice({
	name: 'chatsList',
	initialState,
	reducers: {
		chatSelected: (state, action) => {
			state.selectedChatId = action.payload;
		},
		chatAdded: (state, action) => {
			state.chats.push(action.payload);
		},
		chatUpdated: (state, action) => {
			const { id, name } = action.payload;
			const chat = state.chats.find((chat: any) => chat.id === id);
			chat.name = name;
		},
		fetch: (state, action) => {
			state.loading = true;
		},
		allMessagesLoaded: (state, action) => {
			const chat = state.chats.find((chat: any) => chat.id === action.payload);
			chat.allMessagesLoaded = true;
		},
		messageEditorTextChanged: (state, action) => {
			const chat = state.chats.find((chat: any) => chat.id === action.payload.chatId);
			chat.messageEditorText = action.payload.text;
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchChatList.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(fetchChatList.fulfilled, (state, action) => {
			state.loading = false;
			state.chats = action.payload;
		});
		builder.addCase(fetchChatList.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});

		builder.addCase(fetchChatMessages.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(fetchChatMessages.fulfilled, (state, action) => {
			state.loading = false;
			const chat = state.chats.find((chat: any) => chat.id === action.payload.chatId);
			if (action.payload.messages.length === 0) {
				chat.allMessagesLoaded = true;
				return;
			}
			action.payload.messages.forEach((message: any) => {
				const existingMessage = chat.messages.find((existingMessage: any) => existingMessage.id === message.id);
				if (!existingMessage) {
					chat.messages.push(message);
				}
			});
		});
		builder.addCase(fetchChatMessages.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});
	},
});

export const { chatSelected, chatAdded, chatUpdated, fetch } = chatsListSlice.actions;
