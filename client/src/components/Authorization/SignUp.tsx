import './SignUp.css';

import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { axios } from '../../features/apiCalls';

export default function SignUp() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');

	const signUp = () => {
		axios.post('/users', {
			username,
			password,
		}).then((response: any) => {
			localStorage.setItem('auth', JSON.stringify(response.data));
			window.location.reload();
		});
	}

	return (
		<Card className='mb-3'>
			<Card.Body>
				<Card.Title>Sign Up</Card.Title>
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

					<Form.Group className='mb-3'>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							value={passwordConfirm}
							onChange={(e) => setPasswordConfirm(e.target.value)}
							type='password'
							placeholder='Re-type your password' />
					</Form.Group>
					
					<Button variant='primary' type='submit' disabled={
							username === '' || password === '' || password.length < 6 || password !== passwordConfirm
						}
						onClick={signUp}
					>
						Sign Up
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}