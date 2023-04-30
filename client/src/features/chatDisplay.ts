import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axios } from './apiCalls';

const initialState: any = {
	loading: false,
	error: null,
};

export const chatDisplaySlice = createSlice({
	name: 'chatDisplay',
	initialState,
	reducers: {
		fetch: (state, action) => {
			state.loading = true;
		},
	},
	extraReducers: builder => {
		/*builder.addCase(fetchChatMessages.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(fetchChatMessages.fulfilled, (state, action) => {
			state.loading = false;
		});
		builder.addCase(fetchChatMessages.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});*/
	}
});
