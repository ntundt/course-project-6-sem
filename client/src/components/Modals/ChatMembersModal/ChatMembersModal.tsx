import './ChatMembersModal.css';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { axios } from '../../../features/apiCalls';

export default function ChatMembersModal(props: any) {
	const show = useSelector((state: any) => state.chatMembersModal.show);
	const chat = useSelector((state: any) => state.chatsList.chats?.find((chat: any) => chat.id === state.chatsList.selectedChatId));
	const [members, setMembers] = useState<any[]>([]);

	useEffect(() => {
		if (!show) return;
		axios.get(`/chats/${chat.id}/members`).then((response: any) => {
			setMembers(response.data);
		});
	}, [show]);

	const onHide = () => {
		props.onHide();
	}

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
					Chat Members
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
				{members.map((member: any) => (
					<div key={member.id}>
						{member.username}
					</div>
				))}
			</Modal.Body>
		</Modal>
	);
}