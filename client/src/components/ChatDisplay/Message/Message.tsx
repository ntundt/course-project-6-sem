import './Message.css';

import { useDispatch, useSelector } from 'react-redux';

import config from '../../../config.json';
import Avatar, { getAvatarUrl } from '../../Common/Avatar';
import { fetchUser } from '../../../features/usersSlice';
import { AppDispatch } from '../../../features/store';
import { useEffect, useRef, useState } from 'react';
import { fetchUserById, setMessageRead } from '../../../features/apiCalls';
import classes from '../../Common/classesString';
import TimeDisplay from '../../TimeDipsplay/TimeDisplay';
import DeliveryStatusIcon from './DeliveryStatusIcon/DeliveryStatusIcon';
import useOnScreen from '../../Common/useOnScreen';

export default function Message(props: any) {
	const dispatch = useDispatch<AppDispatch>();
	const messageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		dispatch(fetchUserById(props.message.senderId));
	}, [props.message.senderId]);

	const sender = useSelector((state: any) => state.users.users.find((user: any) => user.id === props.message.senderId));
	const userId = useSelector((state: any) => state.auth.userId);

	const message = props.message;
	const isOwnMessage = userId === sender?.id;
	const attachments = message.attachments;
	const text = message.text;

	const avatarUrl = getAvatarUrl(sender);

	const onScreen = useOnScreen(messageRef);
	useEffect(() => {
		if (onScreen && !message.read && !isOwnMessage) {
			dispatch(setMessageRead(message.chatId, message.id));
		}
	}, [onScreen]);
			

	return (
		<div ref={messageRef} className={classes({
			'Message-container': true,
			'Message-container-own': isOwnMessage,
		})}>

			{ !isOwnMessage &&
				<Avatar
					image={avatarUrl}
					small={true}
					isPrivate={true} />
			}

			<div className={classes({
				'Message': true,
				'Message-own': isOwnMessage,
			})}>
				<div className='Message-visual-attachments-container'>
					{attachments?.filter((attachment: any) => attachment.type === 'image' || attachment.type === 'video')
						.map((attachment: any) => {
						return (
							<div className='Message-visual-attachment-container'>
								{attachment.type === 'image' && <img className='Message-visual-attachment' src={attachment.url} alt='attachment' />}
								{attachment.type === 'video' && <video className='Message-visual-attachment' src={attachment.url} controls></video>}
							</div>
						);
					})}
				</div>
				<div className='Message-text'>{text}</div>
				<div className='Message-sound-and-docs-attachments'>
					{attachments?.filter((attachment: any) => attachment.type === 'audio' || attachment.type === 'document')
						.map((attachment: any) => {
							return (
								<div className='Message-sound-and-docs-attachment-container'>
									{attachment.type === 'audio' && <audio className='Message-sound-and-docs-attachment' src={attachment.url} controls></audio>}
									{attachment.type === 'document' && <a className='Message-sound-and-docs-attachment' href={attachment.url} download>{attachment.name}</a>}
								</div>
							);
						})}
				</div>
				<div className='Message-time-and-read-status-container'>
					{isOwnMessage && <DeliveryStatusIcon style={{userSelect: 'none', color: isOwnMessage ? 'lightgray' : 'gray'}} read={message.read} />}
					<TimeDisplay style={{userSelect: 'none', color: isOwnMessage ? 'lightgray' : 'gray'}} time={message.date} format={'HH:mm'} />
				</div>
			</div>
		</div>
	);
}
