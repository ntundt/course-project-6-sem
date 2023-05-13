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
import { errorAdded, errorsSlice } from './reducers/errorsSlice';
import { notificationsSlice } from './notificationsSlice';
import { chatSettingsSlice } from './reducers/chatSettingsSlice';

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
		chatSettingsModal: chatSettingsSlice.reducer,
		errors: errorsSlice.reducer,
		notifications: notificationsSlice.reducer,
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
		if (response.status >= 200 && response.status < 400) {
			return response;
		}

		return response;
	},
	error => {
		console.log('axios', axios);
		console.log('Error response: ', error);

		store.dispatch(errorAdded({
			err: error.response?.data?.err ?? error.response?.status,
			message: error.response?.data?.message ?? error?.response.statusText,
		}));
			/*{
			type: 'errors/errorAdded',
			payload: {
				err: error.response?.data?.err ?? error.response?.status,
				message: error.response?.data?.message ?? error?.response.statusText,
			},
		});*/

		if (error?.response.status === 401) {
			store.dispatch({ type: 'auth/logout' });
		}

		return Promise.reject(error);
	}
);
