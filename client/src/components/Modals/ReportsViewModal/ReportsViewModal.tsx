import './ReportsViewModal.css';

import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../features/store';
import { useEffect, useState } from 'react';
import { axios } from '../../../features/apiCalls';
import { hideViewModal } from '../../../features/reducers/reportsSlice';
import Message from '../../ChatDisplay/Message/Message';

export default function ReportsViewModal(props: any) {
	const dispatch = useDispatch<AppDispatch>();
	
	const show = useSelector((state: any) => state.reports.viewModal.show);

	const [reports, setReports] = useState<any[]>([]);
	useEffect(() => {
		if (!show) return;
		axios.get('/reports').then((response: any) => {
			setReports(response.data);
		});
	}, [show]);

	const onHide = () => {
		dispatch(hideViewModal());
	};

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
					Reports
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
				{reports.map((report: any) => (
					<div key={report.id}>
						<div>
							<Message
								disableInteraction={true}
								message={report.message}
							/>
						</div>
						<div>
							Reason: {report.reason}
						</div>
						<div className='ReportsViewModal-action-buttons'>
							<button
								type='button'
								className='btn btn-danger'
								onClick={() => {
									axios.put(`/reports/${report.id}`, {
										approved: true,
									}).then(() => {
										setReports(reports.filter((r) => r.id !== report.id));
									});
								}}
							>
								Block user
							</button>
							<button
								type='button'
								className='btn btn-success'
								onClick={() => {
									axios.put(`/reports/${report.id}`, {
										approved: false,
									}).then(() => {
										setReports(reports.filter((r) => r.id !== report.id));
									});
								}}
							>
								Ignore
							</button>
						</div>
						<hr />
					</div>
				))}
			</Modal.Body>
		</Modal>
	);
}

	