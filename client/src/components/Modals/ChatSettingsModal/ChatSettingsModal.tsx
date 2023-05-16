import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../features/store';
import { useState, useRef, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import FontAwesomeIconAsAvatar from '../../Common/FontAwesomeIconAsAvatar';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { axios } from '../../../features/apiCalls';
import { hideChatSettingsModal } from '../../../features/reducers/chatSettingsSlice';

export default function ChatSettingsModal(props: any) {
	const dummyAvatarInputRef = useRef<HTMLInputElement>(null);

	const dispatch = useDispatch<AppDispatch>();
	
	const show = useSelector((state: any) => state.chatSettingsModal.show);
	const chatId = useSelector((state: any) => state.chatSettingsModal.chatId);
	
	const [name, setName] = useState('');
	const [avatar, setAvatar] = useState('');
	
	const [somethingChanged, setSomethingChanged] = useState(false);

	const onHide = () => {
		dispatch(hideChatSettingsModal());
	};

	const uploadAvatar = () => {
		dummyAvatarInputRef.current?.click();
	};

	const uploadAvatarHandler = (e: any) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];

			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = async () => {
				const formData = new FormData();
				formData.append('file', file);

				axios({
					method: 'post',
					url: '/attachments',
					data: formData,
					headers: { 'Content-Type': 'multipart/form-data' },
				}).then((response: any) => {
					setAvatar(response.data.url);
					setSomethingChanged(true);
				});
			};
		}
	};

	const onSave = () => {
		axios.put(`/chats/${chatId}`, {
			name,
			avatar: avatar.replace(/^(.*)(\/uploads\/.+$)/g, '$2'),
		}).then(() => {
			onHide();
		});
	};

	useEffect(() => {
		if (!show) return;
		axios.get(`/chats/${chatId}`).then((response: any) => {
			setName(response.data.chatName);
			setAvatar(response.data.chatAvatar);
		});
	}, [show]);
	
	return (
		<Modal show={show} onHide={onHide} centered>
			<Modal.Header>
				<Modal.Title>Chat settings</Modal.Title>
				<button
					type='button'
					className='close'
					onClick={onHide}
				>
					<span aria-hidden='true'>&times;</span>
				</button>
			</Modal.Header>
			
			<Modal.Body>

				<div className='SettingsModalContent-profile-info'>
					<div className='SettingsModalContent-profile-info-image-container'>
						{ avatar && (
							<img src={avatar} alt='avatar'
								className='SettingsModalContent-profile-info-image'
								onClick={() => uploadAvatar()} />
						)}
						{ !avatar && (
							<FontAwesomeIconAsAvatar
								width={100}
								height={100}
								icon={faUserGroup}
								onClick={() => uploadAvatar()} />
						)}
						<input type='file' ref={dummyAvatarInputRef} hidden={true}
							onChange={uploadAvatarHandler} />
					</div>
					<div className='SettingsModalContent-profile-info-name-container'>
						<Form.Control
							placeholder='Name'
							className='mb-3'
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								setSomethingChanged(true);
							}} />
					</div>
				</div>

			</Modal.Body>

			<Modal.Footer>
				<Button
					variant="primary"
					onClick={onSave}
					disabled={!somethingChanged}
				>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
}