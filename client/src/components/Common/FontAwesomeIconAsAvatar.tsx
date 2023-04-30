import './FontAwesomeIconAsAvatar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FontAwesomeIconAsAvatar(props: any) {
	const width = props.width ?? 54;
	const height = props.height ?? 54;

	const iconPadding = width * 2 / 9;

	return (
		<div className='FontAwesomeIconAsAvatar'
			style={{
				width: width,
				height: height,
			}}>
			<FontAwesomeIcon
				className='FontAwesomeIconAsAvatar-icon'
				color={props.color ?? 'white'}
				fontSize={props.fontSize ?? '1.5rem'}
				style={{
					padding: iconPadding,
					width: width - iconPadding * 2,
					height: height - iconPadding * 2,
				}}
				icon={props.icon} />
		</div>
	);
}
