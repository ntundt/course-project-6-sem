import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axios } from '../apiCalls';
import initialState from '../initialState';

export const chatCreationSlice = createSlice({
	name: 'chatCreationModal',
	initialState: initialState.chatCreationModal,
	reducers: {
		showCreationModal: (state, action) => {
			state.show = true;
		},
		hideCreationModal: (state, action) => {
			state.show = false;
		},
	},
});

export const {
	showCreationModal,
	hideCreationModal,
} = chatCreationSlice.actions;
