import './SettingsModal.css';

import React, { useState } from 'react';
import { ListGroup, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../features/store';
import { hideSettingsModal } from '../../../features/settingsSlice';
import SettingsModalContent from './SettingsModalContent';
import { axios } from '../../../features/apiCalls';
import classes from '../../Common/classesString';

export default function SettingsModal(props: any) {
	const dispatch = useDispatch<AppDispatch>();
	
	const show = useSelector((state: any) => state.settingsModal.show);

	const [canSave, setCanSave] = useState(false);
	const [saveData, setSaveData] = useState<any>({});

	const onChange = (data: any) => {
		console.log(data, saveData.newPassword === saveData.confirmNewPassword);
		setCanSave(data.somethingChanged);
		setSaveData(data);
	};

	const onHide = () => {
		dispatch(hideSettingsModal());
	};

	const onSave = () => {
		axios.put('/current-user', {
			name: saveData.name,
			username: saveData.username,
			avatar: saveData.avatar.replace(/^(.*)(\/uploads\/.+$)/g, '$2'),
			currentPassword: saveData.currentPassword ? saveData.currentPassword : undefined,
			newPassword: saveData.newPassword ? saveData.newPassword : undefined,
		}).then(() => {
			onHide();
		});
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
					Settings
				</Modal.Title>
				<button
					type='button'
					className='close'
					onClick={onHide}
				>
					<span aria-hidden='true'>&times;</span>
				</button>
			</Modal.Header>
			<SettingsModalContent
				onHide={onHide}
				onChange={onChange}
			/>
			<Modal.Footer>
				<Button
					type='button'
					className={classes({
						'disabled': !canSave || saveData.newPassword !== saveData.confirmNewPassword,
					})}
					onClick={onSave}
					disabled={!canSave || saveData.newPassword !== saveData.confirmNewPassword}
				>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
}