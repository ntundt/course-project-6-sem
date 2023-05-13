import './LogIn.css';

import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { axios } from '../../features/apiCalls';
import { useHotkeys } from 'react-hotkeys-hook';

export default function LogIn(props: any) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const logIn = () => {
		axios.post('/auth', {
			username,
			password,
		}).then((response: any) => {
			localStorage.setItem('auth', JSON.stringify(response.data));
			window.location.reload();
		});
	};

	useHotkeys('enter', logIn, { enableOnFormTags: true });

	return (
		<Card className='mb-3'>
			<Card.Body>
				<Card.Title>Log In</Card.Title>
				<Form>
					<Form.Group className='mb-3'>
						<Form.Label>Username</Form.Label>
						<Form.Control
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							type='text'
							placeholder='Enter your username' />
					</Form.Group>

					<Form.Group className='mb-3'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type='password'
							placeholder='Password' />
					</Form.Group>
					
					<Button variant='primary' disabled={
							username === '' || password === '' || password.length < 6
						}
						onClick={logIn}
					>
						Log In
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}