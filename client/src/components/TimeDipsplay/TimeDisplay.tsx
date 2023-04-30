import './TimeDisplay.css';
import moment from 'moment';

export default function TimeDisplay(props: any) {
	let time = props.time;
	if (typeof time === 'string') {
		time = new Date(props.time);
	}

	return (
		<span {...props} title={moment(props.time).format('LLLL')} className='TimeDisplay'>
			{!props.format && moment(props.time).local().fromNow()}
			{props.format && moment(props.time).local().format(props.format)}
		</span>
	);
}