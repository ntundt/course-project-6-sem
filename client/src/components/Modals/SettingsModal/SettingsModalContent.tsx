import './SettingsModalContent.css';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../features/store';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';

import { axios } from '../../../features/apiCalls';
import FontAwesomeIconAsAvatar from '../../Common/FontAwesomeIconAsAvatar';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { getAvatarUrl } from '../../Common/Avatar';
import classes from '../../Common/classesString';
import { userDisabledNotifications, userEnabledNotifications } from '../../../features/notificationsSlice';

export default function SettingsModalContent(props: any) {
	const dispatch = useDispatch<AppDispatch>();

	const dummyAvatarInputRef = useRef<HTMLInputElement>(null);

	const notificationsActive = useSelector((state: any) => state.notifications.userEnabled);
	const toggleNotificationsActive = () => notificationsActive ?
		dispatch(userDisabledNotifications()) : dispatch(userEnabledNotifications());

	const [selectedPage, setSelectedPage] = useState(0);
	const [usernameAvailable, setUsernameAvailable] = useState(false);
	const [username, setUsername] = useState('');
	const [avatar, setAvatar] = useState('');
	const [name, setName] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	const [somethingChanged, setSomethingChanged] = useState(false);

	useEffect(() => {
		axios.get(`/current-user`).then((response: any) => {
			setUsername(response.data.username);
			setAvatar(getAvatarUrl(response.data) ?? '');
			setName(response.data.name);
		});
	}, []);

	const uploadAvatar = () => {
		dummyAvatarInputRef.current?.click();
	};

	const uploadAvatarHandler = (e: any) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];

			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = async () => {
				// convert to form data
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

	useEffect(() => {
		if (username === '') {
			setUsernameAvailable(false);
			return;
		}
		axios.get(`/username-available/${username}`).then((response: any) => {
			setUsernameAvailable(response.data.success);
		});
	}, [username]);

	useEffect(() => {
		if (!props.onChange) return;
		props.onChange({
			username,
			name,
			avatar,
			currentPassword,
			newPassword,
			confirmNewPassword,
			somethingChanged,
		});
	}, [
		username,
		name,
		avatar,
		currentPassword,
		newPassword,
		confirmNewPassword,
		somethingChanged
	]);

	return (
		<>
			{ selectedPage === 0 && (
				<>
					{/* component to update user's name, username and profile pic */}
					<Modal.Body>
						<div className='SettingsModalContent-page'>
							<div className='SettingsModalContent-page-header'>
								<h4>Profile</h4>

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
												icon={faUser}
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
										<InputGroup>
											<InputGroup.Text>@</InputGroup.Text>
											<Form.Control
												placeholder='Username'
												value={username}
												onChange={(e) => {
													setUsername(e.target.value);
													setSomethingChanged(true);
												}} />
											<InputGroup.Text>
												{usernameAvailable ? 'Available' : 'Not available'}
											</InputGroup.Text>
										</InputGroup>										
									</div>
								</div>

								<h4>Change password</h4>

								<InputGroup className='mb-3'>
									<Form.Control
										type='password'
										placeholder='Current password'
										value={currentPassword}
										onChange={(e) => {
											setCurrentPassword(e.target.value);
											setSomethingChanged(true);
										}}
									/>
								</InputGroup>

								<InputGroup className='mb-3'>
									<Form.Control
										type='password'
										placeholder='New password'
										value={newPassword}
										onChange={(e) => {
											setNewPassword(e.target.value);
											setSomethingChanged(true);
										}}
									/>
								</InputGroup>

								<InputGroup className='mb-3'>
									<Form.Control
										type='password'
										placeholder='Confirm new password'
										className={classes({
											'is-invalid': newPassword !== confirmNewPassword,
										})}
										value={confirmNewPassword}
										onChange={(e) => {
											setConfirmNewPassword(e.target.value);
											setSomethingChanged(true);
										}}
									/>
								</InputGroup>

							</div>

							<h4>Browser notifications</h4>

							<Button
								onClick={toggleNotificationsActive}
								>
								{notificationsActive ? 'Disable' : 'Enable'}
							</Button>

							<h4>Actions</h4>

							<div className='SettingsModalContent-page-footer'>
								<button className='btn btn-danger'
									onClick={() => {
										localStorage.removeItem('auth');
										window.location.reload();
									}}>
									Logout
								</button>
							</div>
						</div>
					</Modal.Body>
				</>
			)}
		</>
	);
}