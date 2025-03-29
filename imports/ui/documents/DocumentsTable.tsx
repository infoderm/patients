import React, {useCallback, useMemo} from 'react';

import isValid from 'date-fns/isValid';

import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';

import {
	DataGrid,
	type GridColDef,
	type GridRenderCellParams,
	GridToolbar,
	type GridValueFormatterParams,
} from '@mui/x-data-grid';

import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

import {useDateFormat} from '../../i18n/datetime';

import {type DocumentDocument} from '../../api/collection/documents';
import ReactivePatientChip from '../patients/ReactivePatientChip';
import {useLocaleText} from '../../i18n/dataGrid';
import Tooltip from '../accessibility/Tooltip';
import useDataGridModelContextState from '../data-grid/useDataGridModelContextState';

type Row = {
	encoding?: string;
	format?: string;
	kind?: string;
	datetime?: Date;
	identifier?: string;
	reference?: string;
	parsed?: boolean;
	patientName?: string;
	patientId?: string;
	anomalies?: number;
	status?: string;
	deleted?: boolean;
	lastVersion?: boolean;
};

type Props = {
	readonly items: DocumentDocument[];
};

const DocumentsTable = ({items}: Props) => {
	const localeText = useLocaleText();

	const format = useDateFormat('PPP');

	const dateValueFormatter = useCallback(
		({value}: GridValueFormatterParams<Date>) =>
			isValid(value) ? format(value) : value,
		[format],
	);

	const columns = useMemo(
		(): Array<GridColDef<Row>> => [
			{
				field: 'createdAt',
				headerName: 'Created at',
				flex: 1,
				valueFormatter: dateValueFormatter,
			},
			{field: 'encoding', headerName: 'Encoding', width: 50},
			{field: 'parsed', headerName: 'Parsed', width: 50},
			{field: 'format', headerName: 'Format', width: 90},
			{field: 'kind', headerName: 'Kind', width: 70},
			{
				field: 'datetime',
				headerName: 'Datetime',
				flex: 1,
				valueFormatter: dateValueFormatter,
			},
			{field: 'identifier', headerName: 'Identifier', flex: 1},
			{field: 'reference', headerName: 'Reference'},
			{field: 'patientName', headerName: 'Subject', flex: 1},
			{
				field: 'patientId',
				headerName: 'Patient',
				flex: 1,
				renderCell: ({value: patientId}: GridRenderCellParams<any, string>) =>
					patientId === undefined ? null : (
						<ReactivePatientChip patient={{_id: patientId}} />
					),
			},
			{field: 'anomalies', headerName: 'Anomalies', width: 30},
			{
				field: 'status',
				headerName: 'Status',
				description: 'Status',
				width: 50,
				renderCell({value}: GridRenderCellParams<any, string | undefined>) {
					switch (value) {
						case undefined: {
							return <></>;
						}

						case 'complete': {
							return (
								<Tooltip title="complete">
									<DoneIcon />
								</Tooltip>
							);
						}

						case 'partial': {
							return (
								<Tooltip title="partial">
									<HourglassEmptyIcon />
								</Tooltip>
							);
						}

						default: {
							return (
								<Tooltip title={value}>
									<QuestionMarkIcon />
								</Tooltip>
							);
						}
					}
				},
			},
			{
				field: 'deleted',
				headerName: 'Deleted',
				filterable: false,
				width: 50,
				renderCell: ({value}: GridRenderCellParams<any, boolean>) =>
					value ? (
						<Tooltip title="deleted">
							<DeleteIcon />
						</Tooltip>
					) : (
						<></>
					),
			},
			{
				field: 'lastVersion',
				headerName: 'LastVersion',
				width: 50,
				renderCell: ({value}: GridRenderCellParams<any, boolean>) =>
					value ? (
						<></>
					) : (
						<Tooltip title="old version">
							<HistoryIcon />
						</Tooltip>
					),
			},
		],
		[dateValueFormatter],
	);

	const rows = useMemo(
		() =>
			items.map(
				({
					_id,
					kind,
					format,
					encoding,
					parsed,
					patient,
					patientId,
					datetime,
					createdAt,
					reference,
					identifier,
					anomalies,
					status,
					deleted,
					lastVersion,
				}) => ({
					id: _id,
					createdAt,
					encoding,
					parsed,
					format,
					kind,
					datetime,
					identifier,
					reference,
					patientName: parsed
						? `${patient.lastname} ${patient.firstname}`
						: undefined,
					patientId,
					anomalies,
					status,
					deleted,
					lastVersion,
				}),
			),
		[items],
	);

	const rowCount = 100;

	const {onSortModelChange, onFilterModelChange, onPaginationModelChange} =
		useDataGridModelContextState();

	return (
		<Box sx={{height: 720, width: '100%'}}>
			<DataGrid
				disableRowSelectionOnClick
				localeText={localeText}
				initialState={{
					columns: {
						columnVisibilityModel: {
							encoding: false,
							parsed: false,
							anomalies: false,
						},
					},
					sorting: {
						sortModel: [
							{
								field: 'createdAt',
								sort: 'desc',
							},
						],
					},
					pagination: {
						paginationModel: {page: 0, pageSize: 10},
					},
				}}
				rows={rows}
				columns={columns}
				pageSizeOptions={[10]}
				components={{
					Toolbar: GridToolbar,
					NoRowsOverlay: CustomNoRowsOverlay,
				}}
				componentsProps={{
					toolbar: {
						printOptions: {
							disableToolbarButton: true,
						},
						csvOptions: {
							disableToolbarButton: true,
						},
					},
				}}
				sortingMode="server"
				filterMode="server"
				paginationMode="server"
				rowCount={rowCount}
				onSortModelChange={onSortModelChange}
				onFilterModelChange={onFilterModelChange}
				onPaginationModelChange={onPaginationModelChange}
			/>
		</Box>
	);
};

export default DocumentsTable;

const StyledGridOverlay = styled('div')(({theme}) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100%',
	'& .ant-empty-img-1': {
		fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
	},
	'& .ant-empty-img-2': {
		fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
	},
	'& .ant-empty-img-3': {
		fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
	},
	'& .ant-empty-img-4': {
		fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
	},
	'& .ant-empty-img-5': {
		fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
		fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
	},
}));

const CustomNoRowsOverlay = () => (
	<StyledGridOverlay>
		<svg
			aria-hidden
			width="120"
			height="100"
			viewBox="0 0 184 152"
			focusable="false"
		>
			<g fill="none" fillRule="evenodd">
				<g transform="translate(24 31.67)">
					<ellipse
						className="ant-empty-img-5"
						cx="67.797"
						cy="106.89"
						rx="67.797"
						ry="12.668"
					/>
					<path
						className="ant-empty-img-1"
						d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
					/>
					<path
						className="ant-empty-img-2"
						d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
					/>
					<path
						className="ant-empty-img-3"
						d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
					/>
				</g>
				<path
					className="ant-empty-img-3"
					d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
				/>
				<g className="ant-empty-img-4" transform="translate(149.65 15.383)">
					<ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
					<path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
				</g>
			</g>
		</svg>
		<Box sx={{mt: 1}}>No Rows</Box>
	</StyledGridOverlay>
);
