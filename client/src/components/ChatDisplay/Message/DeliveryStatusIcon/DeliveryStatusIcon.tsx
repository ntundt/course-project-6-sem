import './DeliveryStatusIcon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';

export default function DeliveryStatusIcon(props: any) {
	return (
		<div className='DeliveryStatusIcon'>
			{!props.read && <FontAwesomeIcon
				{...props}
				icon={faCheck}
				color='white'
				fontSize='0.8rem'/>}
			{props.read && <FontAwesomeIcon
				{...props}
				icon={faCheckDouble}
				color='white'
				fontSize='0.8rem'/>}
		</div>
	);
}