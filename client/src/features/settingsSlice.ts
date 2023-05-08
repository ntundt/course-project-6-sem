import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';

export const settingsSlice = createSlice({
	name: 'settings',
	initialState: initialState.settingsModal,
	reducers: {
		showSettingsModal(state) {
			state.show = true;
		},
		hideSettingsModal(state) {
			state.show = false;
		},
	},
});

export const {
	showSettingsModal,
	hideSettingsModal
} = settingsSlice.actions;
