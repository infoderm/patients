import React, {useCallback, useState} from 'react';

import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

import PrintIcon from '@mui/icons-material/Print';

import {styled} from '@mui/material/styles';
import LoadingIconButton from '../button/LoadingIconButton';
import {saveHTMLElementAsPDF} from '../../lib/pdf/pdf';

const PREFIX = 'DocumentToolbar';

const classes = {
	root: `${PREFIX}-root`,
	spacer: `${PREFIX}-spacer`,
	actions: `${PREFIX}-actions`,
	title: `${PREFIX}-title`,
};

const StyledToolbar = styled(Toolbar)(({theme}) => ({
	[`& .${classes.root}`]: {
		paddingRight: theme.spacing(1),
	},
	[`& .${classes.spacer}`]: {
		flex: '1 1 100%',
	},
	[`& .${classes.actions}`]: {
		color: theme.palette.text.secondary,
	},
	[`& .${classes.title}`]: {
		flex: '0 0 auto',
	},
}));

type DocumentToolbarProps = {
	printSource: HTMLElement | null;
};

const DocumentToolbar = ({printSource}: DocumentToolbarProps) => {
	const [pending, setPending] = useState(false);
	const printResults = useCallback(async () => {
		if (printSource === null) return;
		setPending(true);
		try {
			await saveHTMLElementAsPDF(printSource, {filename: 'results.pdf'});
		} finally {
			setPending(false);
		}
	}, [printSource]);

	return (
		<StyledToolbar className={classes.root}>
			<div className={classes.title}>
				<Typography variant="h6" id="tableTitle">
					Results
				</Typography>
			</div>
			<div className={classes.spacer} />
			<div className={classes.actions}>
				<LoadingIconButton
					tooltip="Print"
					loading={pending}
					disabled={!printSource}
					onClick={printResults}
				>
					<PrintIcon />
				</LoadingIconButton>
			</div>
		</StyledToolbar>
	);
};

export default DocumentToolbar;
