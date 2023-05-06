import './UserSelector.css';

import { useEffect, useState } from 'react';
import { Form, InputGroup, Spinner } from 'react-bootstrap';
import { axios } from '../../features/apiCalls';
import UserInfo from './UserInfo';

export default function UserSelector(props: {
	onSelect(selectedUsers: any[]): unknown;
	excludedUserIds?: number[],
	selectMultiple?: boolean,
}) {
	const [searchQuery, setSearchQuery] = useState('');
	const [foundUsers, setFoundUsers] = useState<any[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

	const [isLoading, setIsLoading] = useState(false);

	// For loading animation to be visible for at least 500ms, so popup doesn't flash
	const [loadingTimeout, setLoadingTimeout] = useState<any>(null);

	useEffect(() => {
		if (searchQuery === '') {
			setFoundUsers([]);
			return;
		}
		setIsLoading(true);
		axios.get('/users/search', {
			params: {
				query: searchQuery,
			},
		}).then((response: any) => {
			setFoundUsers(response.data);
			clearTimeout(loadingTimeout);
			setLoadingTimeout(setTimeout(() => {
				setIsLoading(false);
			}, 500));
		});
	}, [searchQuery]);

	useEffect(() => {
		if (!props.selectMultiple) {
			setSelectedUsers([selectedUsers[0]]);
		}
	}, [props.selectMultiple]);

	useEffect(() => {
		props.onSelect(selectedUsers);
	}, [selectedUsers]);

	return (
		<div className='UserSelector'>
			<InputGroup className='mb-3'>
				<Form.Control
					type='text'
					placeholder='Search for users...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</InputGroup>
			
			{ !isLoading && foundUsers.length !== 0 && (
				<div className='UserSelector-users'>
					{foundUsers.map((user: any) => ( props.excludedUserIds && props.excludedUserIds.includes(user.id) ) ? null : (
						<UserInfo
							key={user.id}
							name={user.name}
							avatar={user.avatar}
							username={user.username}
							isSelected={selectedUsers.includes(user)}
							onSelect={() => {
								if (!props.selectMultiple) {
									setSelectedUsers([user]);
									return;
								}
								if (selectedUsers.includes(user)) {
									setSelectedUsers(selectedUsers.filter((u) => u !== user));
								} else {
									setSelectedUsers([...selectedUsers, user]);
								}
							}}
						/>
					))}
				</div>
			)}

			{ !isLoading && foundUsers.length === 0 && (
				<div className='UserSelector-no-users-found'>
					No users found
				</div>
			)}

			{ isLoading && (
				<div className='UserSelector-loading'>
					<Spinner animation='border' />
				</div>
			)}
		</div>				
	);
}