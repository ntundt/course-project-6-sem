import initialState from '../initialState';

const userFetched = (state: any, action: any) => {
	const newState = {
		...state,
		users: [...state.users, action.payload]
	};
	return newState;
};

const userUpdated = (state: any, action: any) => {
	const newState = {
		...state,
		users: state.users.map((user: any) => {
			if (user.id === action.payload.id) {
				return { ...user, ...action.payload, loading: false };
			}
			return user;
		})
	};
	return newState;
};

const userAdded = (state: any, action: any) => {
	const newState = {
		...state,
		users: [...state.users, action.payload],
	};
	return newState;
};

const userFetchPending = (state: any, action: any) => {
	if (state.users.find((user: any) => user.id === action.payload.id)) {
		return state;
	}
	const newState = {
		...state,
		users: [...state.users, { ...action.payload, loading: true }],
	};
	return newState;
};


export default function usersReducer(state = initialState.users, action: any) {
	const { type } = action;
	switch (type) {
		case 'users/userFetch/pending':
			return userFetchPending(state, action);
		case 'users/userFetch/fulfilled':
			return userUpdated(state, action);
		case 'users/userFetch/rejected':
			return userUpdated(state, action);
		default:
			return state;
	}
}
