import React, {useState, useEffect} from 'react';

import classNames from 'classnames';
import {makeStyles, createStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import blue from '@material-ui/core/colors/blue';

const styles = () =>
	createStyles({
		root: {
			display: 'flex',
			zIndex: 999_999_999,
			visibility: 'hidden',
			opacity: 0,
			transition: 'all 0.5s ease-out',
			alignItems: 'center',
			justifyContent: 'center',
			color: 'white',
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100vh',
			backgroundColor: blue[900],
		},
		visible: {
			visibility: 'visible',
			opacity: 0.5,
		},
	});

const useStyles = makeStyles(styles);

const WholeWindowDropZone = ({callback}) => {
	const classes = useStyles();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		let lastTarget;

		const prevent = (e) => e.preventDefault();

		const handleDragEnter = (e) => {
			e.preventDefault();
			lastTarget = e.target;
			setVisible(true);
		};

		const handleDragLeave = (e) => {
			e.preventDefault();
			if (e.target === lastTarget || e.target === document) {
				setVisible(false);
			}
		};

		const handleDrop = async (e) => {
			e.preventDefault();
			setVisible(false);
			const data = e.dataTransfer;
			try {
				await callback(data);
			} catch (error) {
				console.error(error);
			}
		};

		window.addEventListener('dragover', prevent);
		window.addEventListener('dragexit', prevent);
		window.addEventListener('dragenter', handleDragEnter);
		window.addEventListener('dragleave', handleDragLeave);
		window.addEventListener('drop', handleDrop);

		return () => {
			window.removeEventListener('dragover', prevent);
			window.removeEventListener('dragexit', prevent);
			window.removeEventListener('dragenter', handleDragEnter);
			window.removeEventListener('dragleave', handleDragLeave);
			window.removeEventListener('drop', handleDrop);
		};
	}, [callback]);

	return (
		<div
			className={classNames(classes.root, {
				[classes.visible]: visible,
			})}
		>
			<Fab color="primary">
				<AddIcon />
			</Fab>
		</div>
	);
};

export default WholeWindowDropZone;
