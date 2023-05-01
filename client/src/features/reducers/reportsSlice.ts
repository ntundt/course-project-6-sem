import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axios } from '../apiCalls';
import initialState from '../initialState';

/**
 * should have
 * - messageId
 * - chatId
 * - userId
 * - reason
 */
export const submitReport = createAsyncThunk('reports/submit', async (report: { 
	messageId: number,
	chatId: number,
	userId: number,
	reason: string,
}) => {
	const response = await axios.post(`/users/${report.userId}/reports`, report);
	const data = await response.data;
	return data;
});

export const reportsSlice = createSlice({
	name: 'reports',
	initialState: initialState.reports,
	reducers: {
		showModal(state, action) {
			state.modal.show = true;
			state.modal.messageId = action.payload.messageId;
			state.modal.chatId = action.payload.chatId;
			state.modal.userId = action.payload.userId;
			state.modal.reason = '';
		},
		hideModal(state) {
			state.modal.show = false;
			state.modal.messageId = null;
			state.modal.chatId = null;
			state.modal.userId = null;
			state.modal.reason = '';
		},
		setModalReason(state, action) {
			state.modal.reason = action.payload.reason;
		},
	},
	extraReducers: builder => {
		builder.addCase(submitReport.pending, (state, action) => {
			state.loading = true;
		});
		builder.addCase(submitReport.fulfilled, (state, action) => {
			state.loading = false;
			state.modal.show = false;
			state.reports.push(action.payload);
		});
		builder.addCase(submitReport.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error;
		});
	}
});

export const { showModal, hideModal, setModalReason } = reportsSlice.actions;
