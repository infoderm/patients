import React from 'react';

import {styled, lighten} from '@mui/material/styles';

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

type Props = {
	readonly onDelete: () => void;
	readonly numSelected: number;
};

const EnhancedTableToolbar = ({onDelete, numSelected}: Props) => {
	return (
		<Toolbar className={classes.root}>
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
		</Toolbar>
	);
};

const StyledEnhancedTableToolbar = styled(EnhancedTableToolbar)(
	({theme, numSelected}) => ({
		[`& .${classes.root}`]: {
			paddingRight: theme.spacing(1),
			...(numSelected === 0
				? undefined
				: theme.palette.mode === 'light'
				? {
						color: theme.palette.secondary.dark,
						backgroundColor: lighten(theme.palette.secondary.light, 0.4),
				  }
				: {
						color: lighten(theme.palette.secondary.light, 0.4),
						backgroundColor: theme.palette.secondary.dark,
				  }),
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
	}),
);

export default StyledEnhancedTableToolbar;
