import './ChatMembersModal.css';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { axios } from '../../../features/apiCalls';
import { AppDispatch } from '../../../features/store';
import { hideMembersModal, showUserSelectionModal } from '../../../features/reducers/chatMembersSlice';
import UserInfo from '../../Common/UserInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import UserSelectionModal from '../UserSelectionModal/UserSelectionModal';
import UserSelector from '../../Common/UserSelector';

export default function ChatMembersModal(props: any) {
	const dispatch = useDispatch<AppDispatch>();
	
	const show = useSelector((state: any) => state.chatMembersModal.show);
	const chat = useSelector((state: any) => state.chatsList.chats?.find((chat: any) => chat.id === state.chatsList.selectedChatId));
	const currentUserId = useSelector((state: any) => state.auth.userId);
	const [members, setMembers] = useState<any[]>([]);
	const userSelectionModalShow = useSelector((state: any) => state.chatMembersModal.s);
	const [selectedPage, setSelectedPage] = useState(0);

	useEffect(() => {
		if (!show) return;
		axios.get(`/chats/${chat.id}/members`).then((response: any) => {
			setMembers(response.data);
		});
	}, [show]);

	const onHide = () => {
		dispatch(hideMembersModal({}));
	}

	const onAddMember = () => {
		setSelectedPage(1);
	}

	const onCancelAddMember = () => {
		setSelectedPage(0);
	}

	return (
		<Modal
			show={show}
			onHide={onHide}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			{selectedPage === 0 && (<>
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
					<div className='ChatMembersModal-header'>
						<button className='ChatMembersModal-add-member-button'
							onClick={onAddMember}>
							<FontAwesomeIcon icon={faPlus} />
							Add member
						</button>
					</div>
					<div className='ChatMembersModal-users-list'>
						{members.map((member: any) => ( props.excludedUserIds?.includes(member.id) ? null :
							<UserInfo
								key={member.id}
								username={member.username}
								avatar={member.avatar}
								isSelected={false}
								name={member.name}
								showDeleteControl={member.id === currentUserId || chat.creatorId === currentUserId}
								isChatCreator={chat.creatorId === member.id}
								onDelete={() => {
									axios.delete(`/chats/${chat.id}/members/${member.id}`).then((response: any) => {
										setMembers(members.filter((m: any) => m.id !== member.id));
									});
								}}
							/>
						))}
					</div>
				</Modal.Body>
			</>)}
			{selectedPage === 1 && ( <>
				<Modal.Header>
					<Modal.Title id='contained-modal-title-vcenter'>
						Add member
					</Modal.Title>
					<button
						type='button'
						className='close'
						onClick={onCancelAddMember}
					>
						<span aria-hidden='true'>&times;</span>
					</button>
				</Modal.Header>
				<Modal.Body>
				<UserSelector
					excludedUserIds={members.map((m: any) => m.id)}
					onSelect={(selectedUsers: any[]) => {
						if (selectedUsers.length === 0 || typeof selectedUsers[0] === 'undefined') return;
						axios.post(`/chats/${chat.id}/members/${selectedUsers[0].id}`).then((response: any) => {
							setMembers([...members, selectedUsers[0]]);
							setSelectedPage(0);
						});
					}}
				/>
				</Modal.Body>
			</>)}
		</Modal>
	);
}
