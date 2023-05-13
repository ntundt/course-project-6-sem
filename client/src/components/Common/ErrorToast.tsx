import { useEffect, useState } from 'react';
import { Toast } from 'react-bootstrap';

export default function ErrorToast(props: any) {
	const [show, setShow] = useState(true);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setShow(false);
		}, 10000);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return (
		<Toast
			onClose={() => setShow(false)}
			show={show}
			animation={true}
			autohide
			style={{
				zIndex: 9999,
			}}
		>
			<Toast.Header closeVariant='white'>
				<strong className='mr-auto'>Error {props.err}</strong>
			</Toast.Header>
			<Toast.Body>{props.message}</Toast.Body>
		</Toast>
	);
}