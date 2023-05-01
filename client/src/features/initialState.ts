const initialState: any = {
	chatsList: {
		chats: [],
		selectedChatId: null,
		loading: false,
		error: null,
	},
	auth: {
		accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJpc01vZGVyYXRvciI6dHJ1ZSwiZXhwaXJlc0F0IjoyMDAwMDAwMDAwfQ._YXEmyXVA1HW-BY0V4bkiFKB6DX9rFlQEqtwC_V5Xzo',
		expiresAt: 2000000000000,
		userId: 16,
		isAdmin: true,
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
}

export default initialState;