import { createSlice } from '@reduxjs/toolkit';
import initialState from '../initialState';

export const chatSettingsSlice = createSlice({
	name: 'chatSettings',
	initialState: initialState.chatSettingsModal,
	reducers: {
		showChatSettingsModal: (state, action) => {
			state.show = true;
			state.chatId = action.payload.chatId;
		},
		hideChatSettingsModal: (state) => {
			state.show = false;
			state.chatId = null;
		},
	},
});

export const {
	showChatSettingsModal,
	hideChatSettingsModal,
} = chatSettingsSlice.actions;
