import { createSlice } from '@reduxjs/toolkit';
import initialState from '../initialState';

export const errorsSlice = createSlice({
	name: 'errors',
	initialState: initialState.errors,
	reducers: {
		errorAdded: (state, action) => {
			state.errors = [...state.errors, action.payload];
		},
	},
});

export const { errorAdded } = errorsSlice.actions;