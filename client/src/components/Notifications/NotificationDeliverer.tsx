import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../features/store';

export default function NotificationDeliverer(props: {
	notificationSource: any,
}) {
	const dispatch = useDispatch<AppDispatch>();

	const active = useSelector((state: any) => state.notifications.active);
	const userEnabled = useSelector((state: any) => state.notifications.userEnabled);

	const handler = (data: any) => {
		console.log(data);
	
		if (data.type === 'chatsList/messageReceived') {
			const notification = new Notification('New messsage', {
				body: data.payload.text
			});
	
			notification.onclick = () => {
				window.focus();
	
				dispatch({
					type: 'chatList/chatSelected',
					data: {
						chatId: data.payload.chatId,
					},
				});
			};
		} else if (data.type === 'chatsList/chatCreated') {
			const notification = new Notification('You have been added to a chat', {
				body: 'New chat created: ' + data.payload.name,
			});
	
			notification.onclick = () => {
				window.focus();
	
				dispatch({
					type: 'chatList/chatSelected',
					data: {
						chatId: data.payload.chatId,
					},
				});
			};
		}
	};

	useEffect(() => {
		if(!userEnabled) return;

		if (!('Notification' in window)) {
			console.log('This browser does not support desktop notification');
			return;
		}

		if (Notification.permission !== 'granted') {
			Notification.requestPermission();
		}
	}, [userEnabled]);

	useEffect(() => {
		if (!active) return;
		if (!userEnabled) return;

		props.notificationSource?.on('notification', handler);

		return () => {
			props.notificationSource?.off('notification', handler);
		};
	}, [active]);

	return (
		<></>
	)
}