import { useSelector } from 'react-redux';
import './ErrorContainer.css';
import ErrorToast from './ErrorToast';

export default function ErrorContainer(props: any) {
	const errors = useSelector((state: any) => state.errors.errors);
	
	console.log('errors', errors);

	return (
		<div className='ErrorContainer'>

			{errors.map((error: any, index: number) => (
				<ErrorToast
					key={index}
					err={error.err}
					message={error.message}
				/>
			))}

		</div>
	);
}