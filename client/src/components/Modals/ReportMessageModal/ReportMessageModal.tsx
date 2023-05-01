import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../features/store';
import { hideModal, setModalReason, submitReport } from '../../../features/reducers/reportsSlice';
import classes from '../../Common/classesString';
import Message from '../../ChatDisplay/Message/Message';

export default function ReportMessageModal(props: any) {
	const dispatch = useDispatch<AppDispatch>();

	const show = useSelector((state: any) => state.reports.modal.show);
	const reason = useSelector((state: any) => state.reports.modal.reason);
	const messageId = useSelector((state: any) => state.reports.modal.messageId);
	const chatId = useSelector((state: any) => state.reports.modal.chatId);
	const userId = useSelector((state: any) => state.reports.modal.userId);

	const onHide = () => {
		dispatch(hideModal());
	};

	const onSubmit = () => {
		dispatch(submitReport({
			reason,
			messageId,
			chatId,
			userId,
		}));
	};

	const onReasonChange = (event: any) => {
		dispatch(setModalReason({
			reason: event.target.value
		}));
	};

	const message = useSelector((state: any) =>
		state.chatsList.chats.find((chat: any) =>
			chat.id === chatId)?.messages.find((message: any) =>
				message.id === messageId));

	return (
		<Modal
			show={show}
			onHide={onHide}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Header>
				<Modal.Title id='contained-modal-title-vcenter'>
					Report a message
				</Modal.Title>
				<button
					type='button'
					className='close'
					onClick={onHide}
				>
					<span aria-hidden='true'>&times;</span>
				</button>
			</Modal.Header>

			<Modal.Body>
				<p>
					You are going to report this message:
				</p>

				<p>
					<Message
						message={message}
						disableInteraction={true}
					/>
				</p>

				<input
					type='text'
					className='form-control'
					placeholder='Reason'
					onChange={onReasonChange}
					value={reason}
					style={{
						marginTop: '1.5rem',
					}}
				/>
			</Modal.Body>

			<Modal.Footer>
				<button
					className={classes({
						'btn': true,
						'btn-primary': true,
					})}
					disabled={!reason}
					onClick={onSubmit}
				>
					Submit
				</button>
			</Modal.Footer>
		</Modal>
	);
}
