import './ContextMenu.css';
import classes from './classesString';

// Bootstrap context menu
export default function ContextMenu(props: {
	show: boolean,
	left: number,
	top: number,
	items: { text: string, onClick: () => void }[]
}) {

	if (!props.show) {
		return null;
	}

	console.log('should show context menu');

	return (
		<div className={classes({
			'dropdown-menu': true,
			'd-block': props.show,
		})} style={{
			left: props.left,
			top: props.top,
		}}>
			{props.items.map((item, index) => (
				<a href='#'
					key={index}
					className='dropdown-item'
					onClick={item.onClick}>{item.text}</a>))
			}
		</div>
	);
}
