import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../features/store";
import { hideUserSelectionModal } from "../../../features/reducers/chatMembersSlice";
import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { axios } from "../../../features/apiCalls";
import UserInfo from "../../Common/UserInfo";

export default function UserSelectionModal(props: {
	show: boolean,
	onSelectionConfirmed: (selectedUsers: any[]) => void,
	allowSelfSelection?: boolean,
	allowMultipleSelection?: boolean,
	excludedUserIds?: number[],
}) {

	return (
		<Modal
			//show={show}
			//onHide={onHide}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			
		</Modal>
	);
}
