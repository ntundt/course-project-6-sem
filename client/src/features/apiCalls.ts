import ax from 'axios';

const axios = ax.create({
	baseURL: 'http://localhost:3000/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

const fetchUserById = (userId: number) => {
	return async (dispatch: any, getState: any) => {
		try {
			const user = getState().users.users.find((user: any) => user.id === userId);
			if (user) return;

			dispatch({
				type: 'users/userFetch/pending',
				payload: { id: userId },
			});
			const response = await axios.get(`/users/${userId}`);
			dispatch({
				type: 'users/userFetch/fulfilled',
				payload: response.data,
			});
			return response.data;
		} catch (error) {
			dispatch({
				type: 'users/userFetch/rejected',
				payload: error,
			});
		}
	};
};

const fetchChatList = () => {
	return async (dispatch: any, getState: any) => {
		try {
			dispatch({
				type: 'chatsList/fetch/pending',
			});
			const response = await axios.get(`/chats`);
			dispatch({
				type: 'chatsList/fetch/fulfilled',
				payload: response.data,
			});
		} catch (error) {
			dispatch({
				type: 'chatsList/fetch/rejected',
				payload: error,
			});
		}
	};
};

const fetchMessageHistory = (chatId: number, offset: number, count: number) => {
	return async (dispatch: any, getState: any) => {
		try {
			dispatch({
				type: 'chatsList/fetchChatMessages/pending',
			});
			const response = await axios.get(`/chats/${chatId}/messages?offset=${offset}&count=${count}`);
			dispatch({
				type: 'chatsList/fetchChatMessages/fulfilled',
				payload: {
					chatId,
					messages: response.data,
				},
			}); 
		} catch (error) {
			dispatch({
				type: 'chatsList/fetchChatMessages/rejected',
				payload: error,
			});
		}
	};
};

const sendMessage = (chatId: number, message: {
	text: string,
	attachments: string[],
}) => {
	return async (dispatch: any, getState: any) => {
		try {
			const response = await axios.post(`/chats/${chatId}/messages`, {
				text: message.text,
				attachments: message.attachments,
			});
			dispatch({
				type: 'chatsList/messageSend/fulfilled',
				payload: {
					chatId,
					message: response.data,
				},
			});
		} catch (error) {
			dispatch({
				type: 'chatsList/messageSend/rejected',
				payload: error,
			});
		}
	};
};

const setMessageRead = (chatId: number, messageId: number) => {
	return async (dispatch: any, getState: any) => {
		try {
			const response = await axios.post(`/chats/${chatId}/messages/${messageId}/read`);
		} catch (error) {
			dispatch({
				type: 'chatsList/messageRead/rejected',
				payload: error,
			});
		}
	}
}

export {
	axios,
	fetchUserById,
	fetchChatList,
	fetchMessageHistory,
	sendMessage,
	setMessageRead,
};
