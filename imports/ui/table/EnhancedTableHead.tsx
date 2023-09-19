import React, {useMemo} from 'react';

import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';

const columnData = [
	{id: 'mppcv', numeric: true, disablePadding: false, label: 'MPPCV'},
	{id: 'mpp_nl', numeric: false, disablePadding: true, label: 'Flemish name'},
	{id: 'mpp_fr', numeric: false, disablePadding: true, label: 'French name'},
	{id: 'nvos_', numeric: false, disablePadding: true, label: 'NVOS_'},
];

export type Order = 'asc' | 'desc';

type Props = {
	readonly numSelected: number;
	readonly onRequestSort: (e: any, property: string) => void;
	readonly onSelectAllClick: (e: any, checked: boolean) => void;
	readonly order: Order;
	readonly orderBy: string;
	readonly rowCount: number;
};

const EnhancedTableHead = ({
	onSelectAllClick,
	onRequestSort,
	order,
	orderBy,
	numSelected,
	rowCount,
}: Props) => {
	const createSortHandler = useMemo(() => {
		return (property: string) => (event: any) => {
			onRequestSort(event, property);
		};
	}, [onRequestSort]);

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
						padding={column.disablePadding ? 'none' : undefined}
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
								onClick={createSortHandler(column.id)}
							>
								{column.label}
							</TableSortLabel>
						</Tooltip>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
};

export default EnhancedTableHead;
