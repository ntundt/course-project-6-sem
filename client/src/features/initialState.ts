const initialState: any = {
	chatsList: {
		chats: [],
		selectedChatId: null,
		loading: false,
		error: null,
	},
	auth: {
		accessToken: null,
		userId: null,
		isModerator: null,
		loading: false,
		error: null,
	},
	chatDisplay: {
		loading: false,
		error: null,
	},
	users: {
		users: [],
		loading: false,
		error: null,
	},
	reports: {
		reports: [],
		modal: {
			show: false,
			messageId: null,
			chatId: null,
			userId: null,
			reason: '',
		},
		viewModal: {
			show: false,
		},
		loading: false,
		error: null,
	},
	chatMembersModal: {
		show: false,
		chatId: null,
		loading: false,
		error: null,
	},
	userSelectionModal: {
		show: false,
		loading: false,
		error: null,
	},
	chatCreationModal: {
		show: false,
		loading: false,
		error: null,
	},
	settingsModal: {
		show: false,
		loading: false,
		error: null,
	},
	chatSettingsModal: {
		show: false,
		chatId: null,
		loading: false,
		error: null,
	},
	errors: {
		errors: [],
	},
	notifications: {
		active: false,
		userEnabled: false,
	},
}

export default initialState;