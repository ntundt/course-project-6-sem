import './Authorization.css';

import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import LogIn from './LogIn';
import SignUp from './SignUp';

export default function Authorization(props: any) {
	const [page, setPage] = useState(0);

	return (
		<Container className='d-flex justify-content-center align-items-center' style={{height: '100vh'}}>
			<div className='col-12 col-sm-10 col-md-8 col-lg-5 col-xl-5' style={{maxWidth: 375}}>
				{page === 0 && (
					<LogIn />
				)}
				{page === 1 && (
					<SignUp />
				)}
				<p style={{textAlign: 'center'}}>
					{ page === 0 && (
						<a href='#' onClick={() => setPage(1)}>Don't have an account? Sign up here</a>
					)}
					{ page === 1 && (
						<a href='#' onClick={() => setPage(0)}>Already have an account? Log in here</a>
					)}
				</p>
			</div>
		</Container>
	);
}