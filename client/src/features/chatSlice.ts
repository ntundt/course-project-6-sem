import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: any = {
	messages: [],
	loading: false,
	error: null,
};

const fetchMessageHistory = createAsyncThunk('messages/fetch', async (chatId: number) => {
	const response = await fetch(`http://localhost:3000/api/messages/${chatId}`);
	const data = await response.json();
	return data;
});

export const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		messageReceived: (state, action) => {
			state.messages.push(action.payload);
		},
	},
	extraReducers: builder => {
		builder.addCase(fetchMessageHistory.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(fetchMessageHistory.fulfilled, (state, action) => {
			state.loading = false;
			state.entities = action.payload;
		});
		builder.addCase(fetchMessageHistory.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error;
		});
	}
});
