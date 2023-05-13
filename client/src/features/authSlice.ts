import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: any = {
	accessToken: null,
	expiresAt: null,
	id: 0,
	loading: false,
	error: null,
};

export const fetchToken = createAsyncThunk('auth/fetch', async (credentials: any) => {
	/*const response = await fetch('/api/auth', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(credentials),
	});
	const data = await response.json();*/
	const data = {
		accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJpc01vZGVyYXRvciI6dHJ1ZSwiZXhwaXJlc0F0IjoyMDAwMDAwMDAwfQ._YXEmyXVA1HW-BY0V4bkiFKB6DX9rFlQEqtwC_V5Xzo',
		expiresAt: 2000000000000,
		id: 16,
	};
	return data;
});

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state, action) => {
			state.accessToken = null;
			state.expiresAt = null;
		},
		setAuth: (state, action) => {
			state.accessToken = action.payload.accessToken;
			state.expiresAt = action.payload.expiresAt;
			state.userId = action.payload.userId;
			state.isModerator = action.payload.isModerator;
		},
	},
	extraReducers: builder => {
		builder.addCase(fetchToken.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(fetchToken.fulfilled, (state, action) => {
			state.loading = false;
			state.accessToken = action.payload.accessToken;
			state.expiresAt = action.payload.expiresAt;
			state.id = action.payload.id;
		});
		builder.addCase(fetchToken.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error;
		});
	}
});

export const { logout, setAuth } = authSlice.actions;
