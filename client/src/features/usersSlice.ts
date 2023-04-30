import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axios } from './apiCalls';

const initialState = {
	users: [],
	loading: false,
	error: null,
};

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setUsers: (state: any, action: any) => {
			state.users = action.payload;
		},
		addUser: (state: any, action: any) => {
			if (state.users.find((user: any) => user.id === action.payload.id)) {
				return;
			}
			state.users.push(action.payload);
		},
		updateUser: (state: any, action: any) => {
			const { id, name, avatarUrl } = action.payload;
			const user = state.users.find((user: any) => user.id === id);
			user.name = name;
		},
		saveUser: (state: any, action: any) => {
			const { id, name, avatarUrl } = action.payload;
			const user = state.users.find((user: any) => user.id === id);
			user.name = name;
			user.profilePicUrl = avatarUrl;
		},
	},
});

export const fetchUser = (id: any) => createAsyncThunk('users/fetch', async () => {
	const response = await axios.get(`/users/${id}`);
	return response.data;
});
