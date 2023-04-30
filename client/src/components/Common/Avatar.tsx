import './Avatar.css';

import { faUser, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import FontAwesomeIconAsAvatar from './FontAwesomeIconAsAvatar';

import config from '../../config.json';
import classes from './classesString';

export function getAvatarUrl(userOrChat: any) {
	if (userOrChat?.avatar) {
		return `${config.server.protocol}://${config.server.host}:${config.server.port}${userOrChat.avatar}`
	}
	return null;
}

export default function Avatar(props: any) {
	return (
		<div className={classes({
			'Avatar-image-container': true,
			})}>
			{(() => {
				if (!props.image) {
					return <FontAwesomeIconAsAvatar
						width={props.small ? 36 : 54}
						height={props.small ? 36 : 54}
						icon={props.isPrivate ? faUserGroup : faUser} />;
				}
				return (
					<img className={[
							'Avatar-image',
							props.small ? 'Avatar-small' : ''
						].join(' ')} 
						width={props.small ? 36 : 54}
						height={props.small ? 36 : 54}
						src={props.image} alt={props.name} />
				);
			})()}
		</div>
	);
}
