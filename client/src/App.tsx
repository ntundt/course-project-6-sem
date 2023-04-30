import './App.css';
import './index.css';

import ChatList from './components/ChatList/ChatList';
import ChatDisplay from './components/ChatDisplay/ChatDisplay';

import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './features/store';
import { fetchToken } from './features/authSlice';

function App() {
	const dispatch = useDispatch<AppDispatch>();

	const [socket, setSocket] = useState<Socket>();
	const auth = useSelector<any, any>(state => state.auth);

	useEffect(() => {
		const newSocket = io('http://localhost:3000', {
			auth: {
				token: auth.accessToken
			}
		});
		setSocket(newSocket);

		newSocket.connect();

		newSocket.on('notification', (data: any) => {
			dispatch(data);
		});

		return () => { 
			newSocket.close();
		};
	}, [auth]);

	/*useEffect(() => {
		dispatch(fetchToken({
			username: 'user1',
			password: 'password'
		}));
	}, [dispatch]);*/

	return (
		<div className="App container-fluid hm-100">
			<div className="row w-100 hm-100">
				<ChatList />
				<ChatDisplay />
			</div>
		</div>
	);
}

export default App;
