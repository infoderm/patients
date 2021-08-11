import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import {Link} from 'react-router-dom';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles, makeStyles, createStyles} from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {lighten} from '@material-ui/core/styles/colorManipulator';

import {Drugs} from '../../api/drugs';

const columnData = [
	{id: 'mppcv', numeric: true, disablePadding: false, label: 'MPPCV'},
	{id: 'mpp_nl', numeric: false, disablePadding: true, label: 'Flemish name'},
	{id: 'mpp_fr', numeric: false, disablePadding: true, label: 'French name'},
	{id: 'nvos_', numeric: false, disablePadding: true, label: 'NVOS_'},
];

class EnhancedTableHead extends React.Component {
	createSortHandler = (property) => (event) => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const {onSelectAllClick, order, orderBy, numSelected, rowCount} =
			this.props;

		return (
			<TableHead>
				<TableRow>
					<TableCell padding="checkbox">
						<Checkbox
							indeterminate={numSelected > 0 && numSelected < rowCount}
							checked={numSelected === rowCount}
							onChange={onSelectAllClick}
						/>
					</TableCell>
					{columnData.map((column) => (
						<TableCell
							key={column.id}
							align={column.numeric ? 'right' : undefined}
							padding={column.disablePadding ? 'none' : 'default'}
							sortDirection={orderBy === column.id ? order : false}
						>
							<Tooltip
								title="Sort"
								placement={column.numeric ? 'bottom-end' : 'bottom-start'}
								enterDelay={300}
							>
								<TableSortLabel
									active={orderBy === column.id}
									direction={order}
									onClick={this.createSortHandler(column.id)}
								>
									{column.label}
								</TableSortLabel>
							</Tooltip>
						</TableCell>
					))}
				</TableRow>
			</TableHead>
		);
	}
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.string.isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = (theme) => ({
	root: {
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.type === 'light'
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
});

const useStyles = makeStyles(toolbarStyles);

const EnhancedTableToolbar = ({onDelete, numSelected}) => {
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

EnhancedTableToolbar.propTypes = {
	onDelete: PropTypes.func.isRequired,
	numSelected: PropTypes.number.isRequired,
};

const styles = (theme) =>
	createStyles({
		root: {
			width: '100%',
			marginTop: theme.spacing(3),
		},
		table: {
			minWidth: 800,
		},
		tableWrapper: {
			overflowX: 'auto',
		},
	});

function sortRows(data, order, orderBy) {
	return order === 'desc'
		? data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
		: data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
}

class EnhancedTable extends React.Component {
	constructor(props, context) {
		super(props, context);

		const order = 'asc';
		const orderBy = 'mppcv';
		const data = sortRows(Array.from(props.drugs), order, orderBy);

		this.state = {
			order,
			orderBy,
			selected: new Set(),
			data,
			page: 0,
			rowsPerPage: 10,
		};
	}

	UNSAFE_componentWillReceiveProps(props) {
		this.setState(({order, orderBy}) => {
			const data = sortRows(Array.from(props.drugs), order, orderBy);
			return {data};
		});
	}

	handleRequestSort = (_event, property) => {
		this.setState((state) => {
			const orderBy = property;
			let order = 'desc';

			if (state.orderBy === property && state.order === 'desc') {
				order = 'asc';
			}

			const data = sortRows(state.data, order, orderBy);
			return {data, order, orderBy};
		});
	};

	handleSelectAllClick = (_event, checked) => {
		if (checked) {
			this.setState((state) => ({
				selected: new Set(state.data.map((n) => n._id)),
			}));
			return;
		}

		this.setState({selected: new Set()});
	};

	handleRowClick = (_event, id) => {
		const {selected} = this.state;
		if (!selected.delete(id)) selected.add(id);
		this.setState({selected});
	};

	handleChangePage = (_event, page) => {
		this.setState({page});
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({rowsPerPage: event.target.value});
	};

	handleDelete = () => {
		const {selected} = this.state;
		for (const _id of selected) {
			Meteor.call('drugs.remove', _id);
		}

		this.setState({selected: new Set()});
	};

	isSelected = (id) => this.state.selected.has(id);

	render() {
		const {classes} = this.props;
		const {data, order, orderBy, selected, rowsPerPage, page} = this.state;
		const emptyRows =
			rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

		return (
			<Paper className={classes.root}>
				<EnhancedTableToolbar
					numSelected={selected.size}
					onDelete={this.handleDelete}
				/>
				<div className={classes.tableWrapper}>
					<Table className={classes.table}>
						<EnhancedTableHead
							numSelected={selected.size}
							order={order}
							orderBy={orderBy}
							rowCount={data.length}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
						/>
						<TableBody>
							{data
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((n) => {
									const isSelected = this.isSelected(n._id);
									return (
										<TableRow
											key={n._id}
											hover
											role="checkbox"
											aria-checked={isSelected}
											tabIndex={-1}
											selected={isSelected}
											onClick={(event) => this.handleRowClick(event, n._id)}
										>
											<TableCell padding="checkbox">
												<Checkbox checked={isSelected} />
											</TableCell>
											<TableCell align="left">
												<Link to={`/drug/${n._id}`}>{n.mppcv}</Link>
											</TableCell>
											<TableCell padding="none">{n.mpp_nl}</TableCell>
											<TableCell padding="none">{n.mpp_fr}</TableCell>
											<TableCell padding="none">{n.nvos_}</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow style={{height: 49 * emptyRows}}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TablePagination
									colSpan={6}
									count={data.length}
									rowsPerPage={rowsPerPage}
									page={page}
									backIconButtonProps={{
										'aria-label': 'Previous Page',
									}}
									nextIconButtonProps={{
										'aria-label': 'Next Page',
									}}
									onChangePage={this.handleChangePage}
									onChangeRowsPerPage={this.handleChangeRowsPerPage}
								/>
							</TableRow>
						</TableFooter>
					</Table>
				</div>
			</Paper>
		);
	}
}

EnhancedTable.propTypes = {
	classes: PropTypes.object.isRequired,
};

const Component = withTracker(({query}) => {
	Meteor.subscribe('drugs.search', query, -20);
	return {
		drugs: Drugs.find().fetch(),
	};
})(withStyles(styles, {withTheme: true})(EnhancedTable));

Component.propTypes = {
	query: PropTypes.string.isRequired,
};

export default Component;
