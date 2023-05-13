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
import ErrorContainer from './components/Common/ErrorContainer';
import { disableNotifications, enableNotifications } from './features/notificationsSlice';
import NotificationDeliverer from './components/Notifications/NotificationDeliverer';
import config from './config.json';
import ChatSettingsModal from './components/Modals/ChatSettingsModal/ChatSettingsModal';

function App() {
	const dispatch = useDispatch<AppDispatch>();

	const [socket, setSocket] = useState<Socket>();
	const accessToken = useSelector((state: any) => state.auth.accessToken);

	useEffect(() => {
		const newSocket = io(`${config.server.protocol}://${config.server.host}:${config.server.port}`, {
			auth: {
				token: accessToken
			}
		});
		setSocket(newSocket);

		newSocket.connect();

		newSocket.on('notification', (data: any) => {
			console.log('dispatching', data);
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

	useEffect(() => {
		window.onfocus = () => {
			dispatch(disableNotifications());
		};

		window.onblur = () => {
			dispatch(enableNotifications());
		};

		return () => {
			window.onfocus = null;
			window.onblur = null;
		};
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
				<ErrorContainer />
				<ChatSettingsModal />
				<NotificationDeliverer notificationSource={socket} />
			</>}

			{ !accessToken &&
				<Autorization />}
		</>
	);
}

export default App;
