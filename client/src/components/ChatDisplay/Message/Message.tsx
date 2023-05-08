import './Message.css';

import { useDispatch, useSelector } from 'react-redux';
import { PhotoAlbum } from 'react-photo-album';

import config from '../../../config.json';
import Avatar, { getAvatarUrl } from '../../Common/Avatar';
import { fetchUser } from '../../../features/usersSlice';
import { AppDispatch } from '../../../features/store';
import { useEffect, useRef, useState } from 'react';
import { fetchUserById, setMessageRead } from '../../../features/apiCalls';
import classes from '../../Common/classesString';
import TimeDisplay from '../../TimeDisplay/TimeDisplay';
import DeliveryStatusIcon from './DeliveryStatusIcon/DeliveryStatusIcon';
import useOnScreen from '../../Common/useOnScreen';
import ContextMenu from '../../Common/ContextMenu';

export default function Message(props: any) {
	const dispatch = useDispatch<AppDispatch>();
	const messageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		dispatch(fetchUserById(props.message?.senderId));
	}, [props.message?.senderId]);

	const sender = useSelector((state: any) => state.users.users.find((user: any) => user.id === props.message?.senderId));
	const userId = useSelector((state: any) => state.auth.userId);

	const message = props.message;
	const isOwnMessage = userId === sender?.id;
	const attachments = message?.attachments;
	const text = message?.text;

	const avatarUrl = getAvatarUrl(sender);

	const onScreen = useOnScreen(messageRef);
	useEffect(() => {
		if (onScreen && !message?.read && !isOwnMessage) {
			dispatch(setMessageRead(message?.chatId, message?.id));
		}
	}, [onScreen]);

	const [showContextMenu, setShowContextMenu] 
		= useState<{ show: boolean, top: number, left: number }>({ show: false, top: 0, left: 0 });
	const onMessageContextMenu = (e: any) => {
		if (props.disableInteraction) return;

		e.preventDefault();

		const contextMenuHidingEvents = [
			'click',
			'contextmenu',
			'wheel',
			'scroll',
		];

		const hideContextMenu = () => {
			setShowContextMenu({ show: false, top: 0, left: 0 });
			contextMenuHidingEvents.forEach((event) => {
				document.removeEventListener(event, hideContextMenu);
			});
		};

		contextMenuHidingEvents.forEach((event) => {
			document.addEventListener(event, (event) => {
				if (event.type === 'contextmenu') {
					if (event.target === e.target) {
						return;
					}
				}
				hideContextMenu();
			});
		});
		
		setShowContextMenu({ show: true, top: e.clientY, left: e.clientX });
	};

	const contextMenuItems = [
		{ text: 'Copy', onClick: () => { navigator.clipboard.writeText(text); } },
	];
	if (!isOwnMessage) {
		contextMenuItems.push({
			text: 'Report',
			onClick: () => {
				dispatch({
					type: 'reports/showModal',
					payload: {
						messageId: message.id,
						chatId: message.chatId,
						userId: message.senderId,
					}
				});
			}
		});
	}
	if (isOwnMessage) {
		contextMenuItems.push({
			text: 'Delete',
			onClick: () => {
				dispatch({
					type: 'messages/deleteMessage',
					payload: {
						messageId: message.id,
						chatId: message.chatId,
					}
				});
			}
		});
	}

	return (
		<div 
			ref={messageRef} 
			onContextMenu={onMessageContextMenu}
			className={classes({
				'Message-container': true,
				'Message-container-own': isOwnMessage,
			})}
		>

			<ContextMenu
				show={showContextMenu.show}
				top={showContextMenu.top}
				left={showContextMenu.left}
				items={contextMenuItems}
			/>

			{ !isOwnMessage &&
				<Avatar
					image={avatarUrl}
					small={true}
					isPrivate={true} />
			}

			<div className={classes({
				'Message': true,
				'Message-own': isOwnMessage,
				'Message-with-attachments': attachments?.length > 0,
			})}>
				{attachments?.length > 0 && 
					<div style={{
						width: '100%',
						borderTopLeftRadius: 12,
						borderTopRightRadius: 12,
						borderBottomLeftRadius: 6,
						borderBottomRightRadius: 6,
						overflow: 'hidden',
						marginBottom: 5,
					}}>
						<PhotoAlbum
							layout='rows'
							targetRowHeight={400}
							spacing={5}
							padding={0}
							photos={attachments?.filter((attachment: any) => 
								attachment.type === 'Image' || attachment.type === 'Video' || attachment.type === 'Animation')
								.map((attachment: any) => ({
									src: attachment.url,
									width: attachment.width,
									height: attachment.height,
								}))}
							renderPhoto={({ photo: { src }, layout: { width, height } }) => {
								const videoExtensions = ['mp4', 'webm', 'ogg'];
								const type = src.split('.').pop() ?? '';
								if (videoExtensions.includes(type)) {
									return (
										<video
											controls
											playsInline
											width={Math.round(width)}
											height={Math.round(height)}
											style={{ objectFit: "cover" }}
										>
											<source type='video/mp4' src={src} />
										</video>
									);
								} else if (type === 'gif') {
									return (
										<img
											src={src}
											width={Math.round(width)}
											height={Math.round(height)}
											style={{ objectFit: "cover" }}
										/>
									)
								}
							}}		
						/>
					</div>
				}
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
					{isOwnMessage && <DeliveryStatusIcon style={{userSelect: 'none', color: isOwnMessage ? 'lightgray' : 'gray'}} read={message?.read} />}
					<TimeDisplay style={{userSelect: 'none', color: isOwnMessage ? 'lightgray' : 'gray'}} time={message?.date} format={'HH:mm'} />
				</div>
			</div>
		</div>
	);
}
