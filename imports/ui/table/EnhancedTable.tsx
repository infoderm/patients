import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Link} from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';

import mergeFields from '../../util/mergeFields';

import remove from '../../api/endpoint/drugs/remove';
import call from '../../api/endpoint/call';

import useDrugs from '../drugs/useDrugs';
import EnhancedTableHead, {type Order} from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedToolbar';

const PREFIX = 'EnhancedTable';

const classes = {
	root: `${PREFIX}-root`,
	table: `${PREFIX}-table`,
	tableWrapper: `${PREFIX}-tableWrapper`,
};

const StyledPaper = styled(Paper)(({theme}) => ({
	[`&.${classes.root}`]: {
		width: '100%',
		marginTop: theme.spacing(3),
	},

	[`& .${classes.table}`]: {
		minWidth: 800,
	},

	[`& .${classes.tableWrapper}`]: {
		overflowX: 'auto',
	},
}));

function sortRows<T>(data: T[], order: Order, orderBy: string) {
	return order === 'desc'
		? Array.from(data).sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
		: Array.from(data).sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
}

type Props = {
	query: string;
};

const EnhancedTable = ({query}: Props) => {
	// TODO split away drug specifics

	// TODO correctly use pagination
	const limit = 20;
	const sort = {score: {$meta: 'textScore'}};
	// mergeFields below is a temporary type hack to
	// hide the fact that score is not 0/1.
	const fields = mergeFields(sort);

	const selector = {$text: {$search: query}};
	const options = {
		fields,
		sort,
		limit,
	};
	const deps = [JSON.stringify(selector), JSON.stringify(options)];

	const {results: drugs} = useDrugs(selector, options, deps);

	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState('mppcv');
	const [selected, setSelected] = useState(new Set());

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const data = useMemo(
		() => sortRows(drugs, order, orderBy),
		[drugs, order, orderBy],
	);

	const handleRequestSort = (_event, property) => {
		const newOrderBy = property;
		const newOrder =
			newOrderBy === orderBy && order === 'desc' ? 'asc' : 'desc';
		setOrderBy(newOrderBy);
		setOrder(newOrder);
	};

	const handleSelectAllClick = (_event, checked) => {
		if (checked) {
			setSelected(new Set(data.map((n) => n._id)));
		} else {
			setSelected(new Set());
		}
	};

	const handleRowClick = (_event, id) => {
		const newSelected = new Set(selected);
		if (!newSelected.delete(id)) newSelected.add(id);
		setSelected(newSelected);
	};

	const handleChangePage = (_event, page) => {
		setPage(page);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(event.target.value);
	};

	const handleDelete = async () => {
		for (const _id of selected) {
			// eslint-disable-next-line no-await-in-loop
			await call(remove, _id);
		}

		setSelected(new Set());
	};

	const isSelected = (id) => selected.has(id);

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

	return (
		<StyledPaper className={classes.root}>
			<EnhancedTableToolbar
				numSelected={selected.size}
				onDelete={handleDelete}
			/>
			<div className={classes.tableWrapper}>
				<Table className={classes.table}>
					<EnhancedTableHead
						numSelected={selected.size}
						order={order}
						orderBy={orderBy}
						rowCount={data.length}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
					/>
					<TableBody>
						{data
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((n) => {
								const isRowSelected = isSelected(n._id);
								return (
									<TableRow
										key={n._id}
										hover
										role="checkbox"
										aria-checked={isRowSelected}
										tabIndex={-1}
										selected={isRowSelected}
										onClick={(event) => {
											handleRowClick(event, n._id);
										}}
									>
										<TableCell padding="checkbox">
											<Checkbox checked={isRowSelected} />
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
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</div>
		</StyledPaper>
	);
};

export default EnhancedTable;
