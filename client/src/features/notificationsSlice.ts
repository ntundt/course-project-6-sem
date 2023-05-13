import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';

export const notificationsSlice = createSlice({
	name: 'notifications',
	initialState: initialState.notifications,
	reducers: {
		enableNotifications: (state) => {
			state.active = true;
		},
		disableNotifications: (state) => {
			state.active = false;
		},
		userEnabledNotifications: (state) => {
			state.userEnabled = true;
		},
		userDisabledNotifications: (state) => {
			state.userEnabled = false;
		},
	},
});

export const {
	enableNotifications,
	disableNotifications,
	userEnabledNotifications,
	userDisabledNotifications,
} = notificationsSlice.actions;
