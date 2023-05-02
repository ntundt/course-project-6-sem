import Avatar from './Avatar'

export default function UserInfo(props: {
	username: string,
	avatar: string,
	name: string,
	isSelected?: boolean,
	onSelect?: () => void,
}) {
	return (
		<div className='UserInfo' onClick={props.onSelect}>
			<Avatar
				image={props.avatar}
			/>
			<div className='UserInfo-name'>
				{props.name}
			</div>
			<div className='UserInfo-username'>
				@{props.username}
			</div>
		</div>
	);
}