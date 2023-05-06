import './ChatCreationModal.css';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../features/store';
import { hideCreationModal } from '../../../features/reducers/chatCreationSlice';
import { axios } from '../../../features/apiCalls';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import UserSelector from '../../Common/UserSelector';

export default function ChatCreationModal() {
	const dispatch = useDispatch<AppDispatch>();

	const show = useSelector((state: any) => state.chatCreationModal.show);

	const [chatName, setChatName] = useState('');
	const [chatDescription, setChatDescription] = useState('');
	const [isPrivate, setIsPrivate] = useState(true);

	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

	const currentUserId = useSelector((state: any) => state.auth.userId);

	const createChat = () => {
		console.log('createChat')
		console.log('chatName: ', chatName)
		console.log('isPrivate: ', isPrivate)
		console.log('selectedUsers: ', selectedUsers)

	};

	const onHide = () => {
		dispatch(hideCreationModal({}));
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
					Create Chat
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
				<InputGroup className='mb-3'>
					<Form.Control
						type='text'
						placeholder='Chat name'
						value={chatName}
						onChange={(e) => setChatName(e.target.value)}
						disabled={isPrivate}
					/>
				</InputGroup>

				<UserSelector
					onSelect={(selectedUsers: any[]) => {
						setSelectedUsers(selectedUsers);
					}}
					excludedUserIds={[currentUserId]}
					selectMultiple={true}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Form.Check
					inline
					label='Create a group chat'
					checked={!isPrivate}
					onChange={() => setIsPrivate(!isPrivate)}/>
				<Button onClick={() => {
					axios.post('/chats', {
						name: chatName,
						isPrivate: isPrivate,
						userIds: selectedUsers.map((user) => user.id),
					}).then((response: any) => {
						dispatch(hideCreationModal({}));
					});
				}}>Confirm</Button>
			</Modal.Footer>
		</Modal>
	);
}
