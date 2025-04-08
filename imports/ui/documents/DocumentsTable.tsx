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
				}}
				slotProps={{
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
