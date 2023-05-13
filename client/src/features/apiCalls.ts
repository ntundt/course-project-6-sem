import ax from 'axios';
import config from '../config.json';

const axios = ax.create({
	baseURL: `${config.server.protocol}://${config.server.host}:${config.server.port}/api`,
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
			if (getState().chatsList.chats.find((chat: any) => chat.id === chatId)?.loading) {
				return;
			}
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
				attachmentIds: message.attachments,
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

const uploadAttachments = (chatId: number, files: File[]) => {
	return async (dispatch: any, getState: any) => {
		try {
			const filesMapped = files.map(file => {
				return {
					fileId: Math.random(),
					file,
					attachment: null,
				}
			})
			dispatch({
				type: 'chatsList/attachmentsUpload/pending',
				payload: {
					chatId,
					files: filesMapped.map(file => ({
						fileId: file.fileId,
						file: {
							name: file.file.name,
							size: file.file.size,
							type: file.file.type,
						},
						attachment: null,
					})),
				}
			});
			for (const file of filesMapped) {
				const formData = new FormData();
				formData.append('file', file.file);
				const response = await axios.post(`/attachments`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
				dispatch({
					type: 'chatsList/attachmentsUpload/fulfilledSingle',
					payload: {
						chatId,
						fileId: file.fileId,
						attachment: response.data,
					}
				});
			}
			dispatch({
				chatId,
				type: 'chatsList/attachmentsUpload/fulfilled',
			});
		} catch (error) {
			dispatch({
				chatId,
				type: 'chatsList/attachmentsUpload/rejected',
				payload: error,
			});
		}
	}
}

const reportMessage = (chatId: number, messageId: number, reason: string) => {
	return async (dispatch: any, getState: any) => {
		try {
			const response = await axios.post(`/chats/${chatId}/messages/${messageId}/report`);
			dispatch({
				type: 'chatsList/messageReport/fulfilled',
				payload: {
					chatId,
					messageId,
				},
			});
		} catch (error) {
			dispatch({
				type: 'chatsList/messageReport/rejected',
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
	uploadAttachments,
	reportMessage,
};
