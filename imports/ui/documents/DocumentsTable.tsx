import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {Link} from 'react-router-dom';

import isValid from 'date-fns/isValid';

import {
	DataGrid,
	type GridColDef,
	type GridRenderCellParams,
	GridToolbar,
	type GridValueFormatterParams,
	type GridRowParams,
	GridActionsCellItem,
	type GridCallbackDetails,
	type GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import {styled} from '@mui/material/styles';

import Box from '@mui/material/Box';
import MuiChip from '@mui/material/Chip';
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
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import IconButton from '@mui/material/IconButton';

import {useDateFormat} from '../../i18n/datetime';

import {type DocumentDocument} from '../../api/collection/documents';
import ReactivePatientChip from '../patients/ReactivePatientChip';
import {useLocaleText} from '../../i18n/dataGrid';
import Tooltip from '../accessibility/Tooltip';
import useDataGridModelContextState from '../data-grid/useDataGridModelContextState';
import {dateTimeFilterOperators} from '../data-grid/filter/dateTimeFilterOperators';
import {booleanFilterOperators} from '../data-grid/filter/booleanFilterOperators';

import LinkChip from '../chips/LinkChip';

import {myEncodeURIComponent} from '../../util/uri';

import DocumentLinkingDialog from './DocumentLinkingDialog';
import DocumentDeletionGenericButton from './actions/DocumentDeletionGenericButton';
import DocumentSuperDeletionGenericButton from './actions/DocumentSuperDeletionGenericButton';
import DocumentRestorationGenericButton from './actions/DocumentRestorationGenericButton';
import DocumentDownloadGenericButton from './actions/DocumentDownloadGenericButton';

const Chip = styled(MuiChip)(() => ({
	margin: 0,
	width: '100%',
}));

type Row = {
	_id: string;
	encoding?: string;
	format?: string;
	kind?: string;
	datetime?: Date;
	identifier?: string;
	reference?: string;
	parsed: boolean;
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

const UnlinkedDocumentChip = ({row}: {readonly row: Row}) => {
	const [linking, setLinking] = useState<boolean>(false);

	return (
		<>
			{row.parsed ? (
				<Tooltip
					title={`${row['patient.lastname']} ${row['patient.firstname']}`}
				>
					<Chip
						icon={<LinkOffIcon />}
						color="red"
						label={`${row['patient.lastname']} ${row['patient.firstname']}`}
						sx={{fontWeight: 'bold'}}
						onClick={(e) => {
							e.stopPropagation();
							setLinking(true);
						}}
					/>
				</Tooltip>
			) : (
				<Tooltip title="not linked">
					<Chip
						icon={<LinkOffIcon />}
						color="red"
						label="not linked"
						onClick={(e) => {
							e.stopPropagation();
							setLinking(true);
						}}
					/>
				</Tooltip>
			)}
			<DocumentLinkingDialog
				open={linking}
				document={row}
				onClose={() => {
					setLinking(false);
				}}
			/>
		</>
	);
};

const DocumentsTable = ({
	loading,
	items,
	page,
	pageSize,
	showDeleted,
}: Props) => {
	const localeText = useLocaleText();

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
				filterOperators: dateTimeFilterOperators,
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
							// eslint-disable-next-line react/jsx-no-useless-fragment
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
				filterOperators: dateTimeFilterOperators,
				valueFormatter: dateValueFormatter,
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
						<UnlinkedDocumentChip row={row} />
					) : (
						<ReactivePatientChip
							patient={{_id: patientId}}
							style={{margin: 0, width: '100%'}}
						/>
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
							// eslint-disable-next-line react/jsx-no-useless-fragment
							return <></>;
						}

						case 'complete': {
							return (
								<Tooltip title="complete">
									<DoneIcon fontSize="small" />
								</Tooltip>
							);
						}

						case 'partial': {
							return (
								<Tooltip title="partial">
									<HourglassEmptyIcon fontSize="small" />
								</Tooltip>
							);
						}

						default: {
							return (
								<Tooltip title={value}>
									<QuestionMarkIcon fontSize="small" />
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
							<DeleteIcon fontSize="small" />
						</Tooltip>
					) : (
						// eslint-disable-next-line react/jsx-no-useless-fragment
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
						// eslint-disable-next-line react/jsx-no-useless-fragment
						<></>
					) : (
						<Tooltip title="old version">
							<HistoryIcon />
						</Tooltip>
					),
			},
			{
				field: 'Actions',
				type: 'actions',
				hideable: false,
				width: 30,
				getActions: ({row}: GridRowParams<Row>) => [
					<DocumentDownloadGenericButton
						key="download"
						disableLoadingFeedback
						showInMenu
						document={row}
						component={GridActionsCellItem}
						icon={<CloudDownloadIcon color="primary" />}
						label="Download"
						aria-label={`Download document #${row._id}`}
					/>,
					...(row.deleted
						? [
								<DocumentRestorationGenericButton
									key="restore"
									showInMenu
									document={row}
									component={GridActionsCellItem}
									icon={<RestoreFromTrashIcon color="primary" />}
									label="Restore"
									aria-label={`Restore document #${row._id}`}
									closeMenuOnClick={false}
								/>,
								<DocumentSuperDeletionGenericButton
									key="super-delete"
									showInMenu
									document={row}
									component={GridActionsCellItem}
									icon={<DeleteForeverIcon color="secondary" />}
									label="Delete forever"
									aria-label={`Delete document #${row._id} forever`}
									closeMenuOnClick={false}
								/>,
						  ]
						: [
								<DocumentDeletionGenericButton
									key="delete"
									showInMenu
									document={row}
									component={GridActionsCellItem}
									icon={<DeleteIcon color="secondary" />}
									label="Delete"
									aria-label={`Delete document #${row._id}`}
									closeMenuOnClick={false}
								/>,
						  ]),
				],
			},
			{
				field: 'Links',
				type: 'actions',
				hideable: false,
				width: 30,
				renderCell: ({row: {_id}}: GridRenderCellParams<any, boolean>) => (
					<Tooltip title="Open in New Tab">
						<IconButton
							size="small"
							component={Link}
							rel="noreferrer"
							target="_blank"
							to={`/document/${_id}`}
							aria-label={`Open document #${_id} in New Tab`}
						>
							<OpenInNewIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				),
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
				sortModel: [],
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
		</Box>
	);
};

export default DocumentsTable;
