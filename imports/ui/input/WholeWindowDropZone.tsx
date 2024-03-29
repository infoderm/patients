import React, {useState, useEffect} from 'react';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import {blue} from '@mui/material/colors';

import makeStyles from '../styles/makeStyles';

const useStyles = makeStyles()({
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

type Options = {
	[key: string]: any;
	readonly callback: (data: any) => Promise<void>;
	readonly className?: string;
};

const WholeWindowDropZone = ({callback, className, ...rest}: Options) => {
	const {classes, cx} = useStyles();
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
			} catch (error: unknown) {
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
			className={cx(
				classes.root,
				{
					[classes.visible]: visible,
				},
				className,
			)}
			{...rest}
		>
			<Fab color="primary">
				<AddIcon />
			</Fab>
		</div>
	);
};

export default WholeWindowDropZone;
