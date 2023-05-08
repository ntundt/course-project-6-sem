import './App.css';
import './index.css';

import ChatList from './components/ChatList/ChatList';
import ChatDisplay from './components/ChatDisplay/ChatDisplay';

import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { AppDispatch } from './features/store';
import { fetchToken, setAuth } from './features/authSlice';
import ReportMessageModal from './components/Modals/ReportMessageModal/ReportMessageModal';
import ReportsViewModal from './components/Modals/ReportsViewModal/ReportsViewModal';
import ChatMembersModal from './components/Modals/ChatMembersModal/ChatMembersModal';
import ChatCreationModal from './components/Modals/ChatCreationModal/ChatCreationModal';
import SettingsModal from './components/Modals/SettingsModal/SettingsModal';
import Autorization from './components/Authorization/Authorization';

function App() {
	const dispatch = useDispatch<AppDispatch>();

	const [socket, setSocket] = useState<Socket>();
	const accessToken = useSelector((state: any) => state.auth.accessToken);

	useEffect(() => {
		const newSocket = io('http://localhost:3000', {
			auth: {
				token: accessToken
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
	}, [accessToken]);

	useEffect(() => {
		const auth = JSON.parse(localStorage.getItem('auth') ?? '{}');
		console.log(auth);
		if (auth.accessToken) {
			dispatch(setAuth(auth));
		}
	}, []);

	return (
		<>
			{ accessToken && <>
				<div className="App container-lg hm-100">
					<div className="row w-100 hm-100">
						<ChatList />
						<ChatDisplay />
					</div>
				</div>
				<ReportMessageModal />
				<ReportsViewModal />
				<ChatMembersModal />
				<ChatCreationModal />
				<SettingsModal />
			</>}

			{ !accessToken &&
				<Autorization />}
		</>
	);
}

export default App;
