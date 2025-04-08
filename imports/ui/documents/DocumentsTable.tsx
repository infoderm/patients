import React, {useCallback, useEffect, useMemo, useState} from 'react';

import isValid from 'date-fns/isValid';

import {
	DataGrid,
	type GridColDef,
	type GridRenderCellParams,
	GridToolbar,
	type GridValueFormatterParams,
	type GridColTypeDef,
	type GridFilterInputValueProps,
	type GridRowParams,
	GridActionsCellItem,
	type GridCallbackDetails,
	type GridColumnVisibilityModel,
	type GridFilterInputBooleanProps,
} from '@mui/x-data-grid';

import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, {type SelectChangeEvent} from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';

import BusinessIcon from '@mui/icons-material/Business';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import TableChartIcon from '@mui/icons-material/TableChart';
import SubjectIcon from '@mui/icons-material/Subject';

import {useDateFormat} from '../../i18n/datetime';

import {type DocumentDocument} from '../../api/collection/documents';
import ReactivePatientChip from '../patients/ReactivePatientChip';
import {useLocaleText} from '../../i18n/dataGrid';
import Tooltip from '../accessibility/Tooltip';
import useDataGridModelContextState from '../data-grid/useDataGridModelContextState';

import LinkChip from '../chips/LinkChip';

import {myEncodeURIComponent} from '../../util/uri';

import DocumentLinkingDialog from './DocumentLinkingDialog';
import {Chip} from './DocumentChips';

import DocumentDeletionIconButton from './actions/DocumentDeletionIconButton';
import DocumentDownloadIconButton from './actions/DocumentDownloadIconButton';

type Row = {
	_id: string;
	encoding?: string;
	format?: string;
	kind?: string;
	datetime?: Date;
	identifier?: string;
	reference?: string;
	parsed?: boolean;
	'patient.firstname'?: string;
	'patient.lastname'?: string;
	patientId?: string;
	anomalies?: number;
	status?: string;
	deleted?: boolean;
	lastVersion?: boolean;
};

type Props = {
	readonly loading: boolean;
	readonly items: DocumentDocument[];
	readonly page: number;
	readonly pageSize: number;
	readonly showDeleted: boolean;
};

const DocumentsTable = ({
	loading,
	items,
	page,
	pageSize,
	showDeleted,
}: Props) => {
	const localeText = useLocaleText();
	const [linking, setLinking] = useState<Row | null>(null);

	const dateFormat = useDateFormat('Pp');

	const dateValueFormatter = useCallback(
		({value}: GridValueFormatterParams<Date>) =>
			isValid(value) ? dateFormat(value) : value,
		[dateFormat],
	);

	const columns = useMemo(
		(): Array<GridColDef<Row>> => [
			{
				field: 'createdAt',
				type: 'dateTime',
				headerName: 'Created at',
				flex: 1,
				filterOperators: getDateTimeFilterOperators(true),
				valueFormatter: dateValueFormatter,
			},
			{field: 'encoding', type: 'string', headerName: 'Encoding', width: 50},
			{
				field: 'parsed',
				type: 'boolean',
				sortable: false,
				headerName: 'Parsed',
				width: 50,
				filterOperators: booleanFilterOperators,
			},
			{
				field: 'format',
				type: 'singleSelect',
				headerName: 'Format',
				valueOptions: ['healthone', 'DMA-REP', 'DMA-LAB'],
				width: 90,
			},
			{
				field: 'kind',
				type: 'singleSelect',
				valueOptions: ['lab', 'report'],
				sortable: false,
				headerName: 'Kind',
				width: 50,
				renderCell({value}: GridRenderCellParams<any, string | undefined>) {
					switch (value) {
						case undefined: {
							return <></>;
						}

						case 'lab': {
							return (
								<Tooltip title="lab">
									<TableChartIcon />
								</Tooltip>
							);
						}

						case 'report': {
							return (
								<Tooltip title="report">
									<SubjectIcon />
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
				field: 'datetime',
				type: 'dateTime',
				headerName: 'Datetime',
				flex: 1,
				hideable: false,
				filterOperators: getDateTimeFilterOperators(true),
				renderCell({value, row}: GridRenderCellParams<any, Date>) {
					if (value === undefined) return null;
					const label = dateFormat(value);
					return (
						<Tooltip title={label}>
							<LinkChip
								icon={<OpenInNewIcon />}
								to={`/document/${row._id}`}
								label={label}
								rel="noreferrer"
								target="_blank"
								aria-label={`Open document #${row._id} in New Tab`}
							/>
						</Tooltip>
					);
				},
			},
			{
				field: 'identifier',
				headerName: 'Identifier',
				flex: 1,
				hideable: false,
				renderCell: ({value}: GridRenderCellParams<any, string>) =>
					value === undefined ? null : (
						<Tooltip title={value}>
							<LinkChip
								icon={<BusinessIcon />}
								to={`/documents/filterBy/identifier/${myEncodeURIComponent(
									value,
								)}`}
								label={value}
							/>
						</Tooltip>
					),
			},
			{
				field: 'reference',
				type: 'string',
				headerName: 'Reference',
				flex: 1,
				hideable: false,
				renderCell: ({
					row: {parsed, identifier, reference},
				}: GridRenderCellParams<any, string>) =>
					parsed ? (
						<Tooltip title={reference}>
							<LinkChip
								icon={<ConfirmationNumberIcon />}
								to={`/document/versions/${myEncodeURIComponent(
									identifier,
								)}/${myEncodeURIComponent(reference)}`}
								label={reference}
							/>
						</Tooltip>
					) : null,
			},
			{
				field: 'patient.lastname',
				type: 'string',
				headerName: 'Lastname',
				flex: 1,
			},
			{
				field: 'patient.firstname',
				type: 'string',
				headerName: 'Firstname',
				flex: 1,
			},
			{
				field: 'patientId',
				type: 'string',
				headerName: 'Patient',
				flex: 1,
				renderCell: ({
					value: patientId,
					row,
				}: GridRenderCellParams<any, string>) =>
					patientId === undefined ? (
						row.parsed ? (
							<Tooltip
								title={`${row['patient.lastname']} ${row['patient.firstname']}`}
							>
								<Chip
									icon={<LinkOffIcon />}
									label={`${row['patient.lastname']} ${row['patient.firstname']}`}
									kind="unlinked"
									onClick={(e) => {
										e.stopPropagation();
										setLinking(row);
									}}
								/>
							</Tooltip>
						) : (
							<Tooltip title="not linked">
								<Chip
									icon={<LinkOffIcon />}
									label="not linked"
									kind="linkoff"
									onClick={(e) => {
										e.stopPropagation();
										setLinking(row);
									}}
								/>
							</Tooltip>
						)
					) : (
						<ReactivePatientChip patient={{_id: patientId}} />
					),
			},
			{
				field: 'anomalies',
				type: 'number',
				headerName: 'Anomalies',
				width: 30,
			},
			{
				field: 'status',
				type: 'singleSelect',
				valueOptions: ['complete', 'partial'],
				sortable: false,
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
				type: 'boolean',
				headerName: 'Deleted',
				filterable: false,
				hideable: false,
				width: 60,
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
				type: 'boolean',
				sortable: false,
				filterOperators: booleanFilterOperators,
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
			{
				field: '_actions',
				type: 'actions',
				width: 30,
				getActions: ({row}: GridRowParams<Row>) => [
					row.deleted ? (
						<></>
					) : (
						<GridActionsCellItem
							showInMenu
							icon={<DeleteIcon color="secondary" />}
							label="Delete"
							aria-label={`Delete document #${row._id}`}
							onClick={() => {}}
						/>
					),
					<GridActionsCellItem
						showInMenu
						icon={<CloudDownloadIcon color="primary" />}
						label="Download"
						onClick={() => {}}
					/>,
				],
			},
		],
		[dateValueFormatter, showDeleted],
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
					_id,
					createdAt,
					encoding,
					parsed,
					format,
					kind,
					datetime,
					identifier,
					reference,
					'patient.firstname': patient?.firstname,
					'patient.lastname': patient?.lastname,
					patientId,
					anomalies,
					status,
					deleted,
					lastVersion,
				}),
			),
		[items],
	);

	const rowCount = rows.length;

	const {onSortModelChange, onFilterModelChange, onPaginationModelChange} =
		useDataGridModelContextState();

	const initialState = useMemo(
		() => ({
			columns: {
				columnVisibilityModel: {
					encoding: false,
					parsed: false,
					anomalies: false,
					deleted: showDeleted,
				},
			},
			sorting: {
				sortModel: [
					{
						field: 'createdAt',
						sort: 'desc',
					} as const,
				],
			},
			pagination: {
				paginationModel: {page, pageSize},
			},
		}),
		[page, pageSize, showDeleted],
	);

	const [columnVisibilityModel, setColumnVisibilityModel] =
		useState<GridColumnVisibilityModel>(
			initialState.columns.columnVisibilityModel,
		);
	const onColumnVisibilityModelChange = useCallback(
		(model: GridColumnVisibilityModel, _: GridCallbackDetails) => {
			setColumnVisibilityModel({...model, deleted: showDeleted});
		},
		[setColumnVisibilityModel, showDeleted],
	);

	useEffect(() => {
		setColumnVisibilityModel((prev) => ({...prev, deleted: showDeleted}));
	}, [setColumnVisibilityModel, showDeleted]);

	return (
		<Box sx={{width: '100%'}}>
			<DataGrid
				autoHeight
				disableRowSelectionOnClick
				hideFooter
				loading={loading}
				localeText={localeText}
				initialState={initialState}
				columnVisibilityModel={columnVisibilityModel}
				rows={rows}
				columns={columns}
				paginationModel={{page, pageSize}}
				pageSizeOptions={[pageSize]}
				slots={{
					loadingOverlay: LinearProgress,
					toolbar: GridToolbar,
					noRowsOverlay: CustomNoRowsOverlay,
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
				onColumnVisibilityModelChange={onColumnVisibilityModelChange}
				onSortModelChange={onSortModelChange}
				onFilterModelChange={onFilterModelChange}
				onPaginationModelChange={onPaginationModelChange}
			/>
			<DocumentLinkingDialog
				open={Boolean(linking)}
				document={linking}
				onClose={() => {
					setLinking(null);
				}}
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

function GridFilterDateInput(
	props: GridFilterInputValueProps & {readonly showTime?: boolean},
) {
	const {item, showTime, applyValue, apiRef} = props;

	const Component = showTime ? DateTimePicker : DatePicker;

	const handleFilterChange = (newValue: unknown) => {
		applyValue({...item, value: newValue});
	};

	return (
		<Component
			autoFocus
			value={item.value || null}
			label={apiRef.current.getLocaleText('filterPanelInputLabel')}
			slotProps={{
				textField: {
					variant: 'standard',
				},
				inputAdornment: {
					sx: {
						'& .MuiButtonBase-root': {
							marginRight: -1,
						},
					},
				},
			}}
			onChange={handleFilterChange}
		/>
	);
}

const serverSideFiltering = (_: unknown) => {
	throw new Error('Client-side filtering not implemented');
};

const getDateTimeFilterOperators = (
	showTime = false,
): GridColTypeDef['filterOperators'] => {
	return [
		{
			value: 'onOrAfter',
			getApplyFilterFn: serverSideFiltering,
			InputComponent: GridFilterDateInput,
			InputComponentProps: {showTime},
		},
		{
			value: 'after',
			getApplyFilterFn: serverSideFiltering,
			InputComponent: GridFilterDateInput,
			InputComponentProps: {showTime},
		},
		{
			value: 'onOrBefore',
			getApplyFilterFn: serverSideFiltering,
			InputComponent: GridFilterDateInput,
			InputComponentProps: {showTime},
		},
		{
			value: 'before',
			getApplyFilterFn: serverSideFiltering,
			InputComponent: GridFilterDateInput,
			InputComponentProps: {showTime},
		},
	];
};

const _valueForOption = (option: 'any' | 'true' | 'false') => {
	switch (option) {
		case 'any': {
			return undefined;
		}

		case 'true': {
			return true;
		}

		case 'false': {
			return false;
		}
	}
};

function GridFilterBooleanInput({
	item,
	applyValue,
	apiRef,
}: GridFilterInputBooleanProps) {
	const handleFilterChange = ({
		target: {value},
	}: SelectChangeEvent<'any' | 'true' | 'false'>) => {
		applyValue({
			...item,
			value: _valueForOption(value as 'any' | 'true' | 'false'),
		});
	};

	const label = apiRef.current.getLocaleText('filterPanelInputLabel');

	return (
		<FormControl fullWidth>
			<InputLabel>{label}</InputLabel>
			<Select
				autoFocus
				value={item.value ?? 'any'}
				label={label}
				onChange={handleFilterChange}
			>
				<MenuItem value="any">
					{apiRef.current.getLocaleText('filterValueAny')}
				</MenuItem>
				<MenuItem value="true">
					{apiRef.current.getLocaleText('filterValueTrue')}
				</MenuItem>
				<MenuItem value="false">
					{apiRef.current.getLocaleText('filterValueFalse')}
				</MenuItem>
			</Select>
		</FormControl>
	);
}

const booleanFilterOperators: GridColTypeDef['filterOperators'] = [
	{
		value: 'is',
		getApplyFilterFn: serverSideFiltering,
		InputComponent: GridFilterBooleanInput,
	},
];
