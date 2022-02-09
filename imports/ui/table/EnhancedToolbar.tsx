import React from 'react';

import classNames from 'classnames';
import {makeStyles} from '@mui/styles';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {lighten} from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.mode === 'light'
			? {
					color: theme.palette.secondary.dark,
					backgroundColor: lighten(theme.palette.secondary.light, 0.4),
			  }
			: {
					color: lighten(theme.palette.secondary.light, 0.4),
					backgroundColor: theme.palette.secondary.dark,
			  },
	spacer: {
		flex: '1 1 100%',
	},
	actions: {
		color: theme.palette.text.secondary,
	},
	title: {
		flex: '0 0 auto',
	},
}));

interface Props {
	onDelete: () => void;
	numSelected: number;
}

const EnhancedTableToolbar = ({onDelete, numSelected}: Props) => {
	const classes = useStyles();

	return (
		<Toolbar
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
						<IconButton aria-label="Delete" onClick={onDelete}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title="Filter list">
						<IconButton aria-label="Filter list">
							<FilterListIcon />
						</IconButton>
					</Tooltip>
				)}
			</div>
		</Toolbar>
	);
};

export default EnhancedTableToolbar;
