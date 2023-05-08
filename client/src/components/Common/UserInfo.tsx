import './UserInfo.css';

import Avatar from './Avatar'
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './classesString';

export default function UserInfo(props: {
	username: string,
	avatar: string | null,
	name: string,
	isSelected?: boolean,
	showDeleteControl?: boolean,
	onDelete?: () => void,
	showSelectControl?: boolean,
	onSelect?: () => void,
	isChatCreator?: boolean,
}) {
	return (
		<div className={classes({
			'UserInfo-container': true,
			'UserInfo-selected': props.isSelected ?? false,
		})} onClick={props.onSelect}>
			<Avatar
				image={props.avatar}
			/>
			
			<div className="UserInfo-info-container">
				<div className='UserInfo-name'>
					{props.name} {props.isChatCreator && <FontAwesomeIcon icon={ faCrown } />}
				</div>
				{ (props.username ?? '').length > 0 && (
					<div className='UserInfo-username'>
						@{props.username}
					</div>
				)}
			</div>
			
			{ props.showDeleteControl && (
				<button
					type='button'
					className='close'
					onClick={props.onDelete}
				>
					<span aria-hidden='true'>&times;</span>
				</button>
			)}

			{ props.showSelectControl && (
				<div className='UserInfo-select-control'>
					{props.isSelected ? (
						<i className='fas fa-check'></i>
					) : (
						<i className='fas fa-plus'></i>
					)}
				</div>
			)}
		</div>
	);
}