import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axios } from '../apiCalls';
import initialState from '../initialState';

export const fetchChatMembers = createAsyncThunk('chatMembers/fetch', async (chatId: any) => {
	const response = await fetch(`/api/chatMembers/${chatId}`);
	const data = await response.json();
	return data;
});

export const chatMembersSlice = createSlice({
	name: 'chatMembers',
	initialState: initialState.chatMembersModal,
	reducers: {
		showMembersModal: (state, action) => {
			state.show = true;
			state.chatId = action.payload.chatId;
		},
		hideMembersModal: (state, action) => {
			state.show = false;
			state.chatId = null;
		},
		showUserSelectionModal: (state, action) => {
			state.showUserSelectionModal = true;
			state.chatId = action.payload.chatId;
		},
		hideUserSelectionModal: (state, action) => {
			state.showUserSelectionModal = false;
			state.chatId = null;
		},
	},
	extraReducers: builder => {
		builder.addCase(fetchChatMembers.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(fetchChatMembers.fulfilled, (state, action) => {
			state.loading = false;
		});
		builder.addCase(fetchChatMembers.rejected, (state, action) => {
			state.loading = false;
		});
	},
});

export const {
	showMembersModal,
	hideMembersModal,
	showUserSelectionModal,
	hideUserSelectionModal,
} = chatMembersSlice.actions;
