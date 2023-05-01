import './TimeDisplay.css';
import moment from 'moment';

export default function TimeDisplay(props: any) {
	let time = props.time;
	if (typeof time === 'string') {
		time = new Date(props.time);
	}

	return (
		<span {...props} title={moment.utc(props.time).local().format('LLLL')} className='TimeDisplay'>
			{!props.format && moment.utc(props.time).local().fromNow()}
			{props.format && moment.utc(props.time).local().format(props.format)}
		</span>
	);
}
