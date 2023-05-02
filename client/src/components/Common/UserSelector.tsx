import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function UserSelector(props: {
	excludedUserIds: number[],
	onSelect: (user: any[]) => void,
	selectSingle: boolean,
}) {
	const [users, setUsers] = useState<any[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
	const [search, setSearch] = useState<string>('');
	
	return (
		<div className='UserSelector'>
			<div className='UserSelector-search'>
				<input type='text' value={search} onChange={e => setSearch(e.target.value)} />
			</div>
			<div className='UserSelector-users'>
				{users.map(user => (
					<div className='UserSelector-user' key={user.id}>
						<div className='UserSelector-user-avatar'>
							<img src={user.avatar} alt='avatar' />
						</div>
						<div className='UserSelector-user-name'>
							{user.name}
						</div>
						<div className='UserSelector-user-username'>
							@{user.username}
						</div>
						<div className='UserSelector-user-select'>
							<input type='checkbox' checked={selectedUsers.includes(user)} onChange={e => {
								if (e.target.checked) {
									setSelectedUsers([...selectedUsers, user]);
								} else {
									setSelectedUsers(selectedUsers.filter(u => u !== user));
								}
							}} />
						</div>
					</div>
				))}
			</div>
			<div className='UserSelector-buttons'>
				<button onClick={() => props.onSelect(selectedUsers)}>Select</button>
			</div>
		</div>							
	);
}