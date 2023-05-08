import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { axios } from './apiCalls';
import chatsListReducer from './reducers/chatsListReducer';
import usersReducer from './reducers/usersReducer';
import initialState from './initialState';
import { chatDisplaySlice } from './chatDisplay';
import { reportsSlice } from './reducers/reportsSlice';
import { chatMembersSlice } from './reducers/chatMembersSlice';
import { chatCreationSlice } from './reducers/chatCreationSlice';
import { settingsSlice } from './settingsSlice';
import { authSlice } from './authSlice';

const authReducer = (state = initialState.auth, action: any) => {
	switch (action.type) {
		case 'auth/login':
			return {
				...state,
				accessToken: action.payload.accessToken,
				refreshToken: action.payload.refreshToken,
				userId: action.payload.userId,
			};
		case 'auth/logout':
			return {
				...state,
				accessToken: null,
				refreshToken: null,
				userId: null,
			};
		default:
			return state;
	}
};

export const store = configureStore({
	preloadedState: initialState,
	reducer: combineReducers({
		chatsList: chatsListReducer,
		auth: authSlice.reducer,
		chatDisplay: chatDisplaySlice.reducer,
		users: usersReducer,
		reports: reportsSlice.reducer,
		chatMembersModal: chatMembersSlice.reducer,
		chatCreationModal: chatCreationSlice.reducer,
		settingsModal: settingsSlice.reducer,
	}),
	middleware: getDefaultMiddleware => getDefaultMiddleware({
		serializableCheck: false,/*{
			ignoredActions: [
				'chatsList/attachmentsUpload/fulfilledSingle',
				'chatsList/attachmentsUpload/pending'
			],
		}*/
	}),
});
export type AppDispatch = typeof store.dispatch;

axios.interceptors.request.use(
	config => {
		const accessToken = store.getState().auth.accessToken;
		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`;
		}
		return config;
	},
	error => {
		Promise.reject(error);
	}
);

axios.interceptors.response.use(
	response => {
		if (response.status === 401) {
			store.dispatch({ type: 'auth/logout' });
		}
		return response;
	},
	error => {
		return Promise.reject(error);
	}
);
