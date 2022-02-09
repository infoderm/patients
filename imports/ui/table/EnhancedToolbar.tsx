import React from 'react';

import {styled, lighten} from '@mui/material/styles';

import classNames from 'classnames';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';

const PREFIX = 'EnhancedTableToolbar';

const classes = {
	root: `${PREFIX}-root`,
	highlight: `${PREFIX}-highlight`,
	spacer: `${PREFIX}-spacer`,
	actions: `${PREFIX}-actions`,
	title: `${PREFIX}-title`,
};

const StyledToolbar = styled(Toolbar)(({theme}) => ({
	[`&.${classes.root}`]: {
		paddingRight: theme.spacing(1),
	},

	[`&.${classes.highlight}`]:
		theme.palette.mode === 'light'
			? {
					color: theme.palette.secondary.dark,
					backgroundColor: lighten(theme.palette.secondary.light, 0.4),
			  }
			: {
					color: lighten(theme.palette.secondary.light, 0.4),
					backgroundColor: theme.palette.secondary.dark,
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

interface Props {
	onDelete: () => void;
	numSelected: number;
}

const EnhancedTableToolbar = ({onDelete, numSelected}: Props) => {
	return (
		<StyledToolbar
			className={classNames(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}
		>
			<div className={classes.title}>
				{numSelected > 0 ? (
					<Typography variant="subtitle1">{numSelected} selected</Typography>
				) : (
					<Typography variant="h6">Drugs</Typography>
				)}
			</div>
			<div className={classes.spacer} />
			<div className={classes.actions}>
				{numSelected > 0 ? (
					<Tooltip title="Delete">
						<IconButton size="large" aria-label="Delete" onClick={onDelete}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title="Filter list">
						<IconButton size="large" aria-label="Filter list">
							<FilterListIcon />
						</IconButton>
					</Tooltip>
				)}
			</div>
		</StyledToolbar>
	);
};

export default EnhancedTableToolbar;
