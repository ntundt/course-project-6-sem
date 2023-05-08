import { useEffect, useState } from 'react';
import './TimeDisplay.css';
import moment from 'moment';

export default function TimeDisplay(props: any) {
	let time = props.time;
	if (typeof time === 'string') {
		time = new Date(props.time);
	}

	console.log('UPDATE', new Date().toUTCString());

	let momentTime = moment.utc(time).local();
	
	const [displayTime, setDisplayTime] = useState(props.format ? momentTime.format(props.format) : momentTime.fromNow());

	useEffect(() => {
		if (props.format) return;

		const interval = setInterval(() => {
			setDisplayTime(props.format ? momentTime.format(props.format) : momentTime.fromNow());
		}, 10000);
		
		return () => {
			clearInterval(interval);
			setDisplayTime(props.format ? momentTime.format(props.format) : momentTime.fromNow());
		}
	});

	return (
		<span {...props} title={momentTime.format('LLLL')} className='TimeDisplay'>
			{displayTime}
		</span>
	);
}
