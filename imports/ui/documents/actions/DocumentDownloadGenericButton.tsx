import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles, createStyles} from '@mui/styles';
import blue from '@mui/material/colors/blue';

import CircularProgress from '@mui/material/CircularProgress';
import {useSnackbar} from 'notistack';
import downloadDocument from './downloadDocument';

const styles = () =>
	createStyles({
		saveButtonWrapper: {
			position: 'relative',
			display: 'inline',
		},
		saveButtonProgress: {
			color: blue[900],
			position: 'absolute',
			top: -14,
			left: 0,
			zIndex: 1,
		},
	});

const useStyles = makeStyles(styles);

const DocumentDownloadGenericButton = ({
	document,
	children,
	component: Component,
	...rest
}) => {
	const classes = useStyles();
	const {enqueueSnackbar} = useSnackbar();
	const [downloading, setDownloading] = useState(false);

	const onClick = async () => {
		setDownloading(true);
		try {
			await downloadDocument(document);
			setDownloading(false);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'unknown error';
			console.error(message);
			console.debug({error});
			enqueueSnackbar(message, {variant: 'error'});
			setDownloading(false);
		}
	};

	const props = downloading ? {...rest, disabled: true} : rest;

	return (
		<div className={classes.saveButtonWrapper}>
			<Component color="primary" onClick={onClick} {...props}>
				{children}
			</Component>
			{downloading && (
				<CircularProgress size={48} className={classes.saveButtonProgress} />
			)}
		</div>
	);
};

DocumentDownloadGenericButton.propTypes = {
	document: PropTypes.object.isRequired,
	component: PropTypes.elementType.isRequired,
};

export default DocumentDownloadGenericButton;
