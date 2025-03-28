import React, { useCallback, useMemo } from 'react';

import isValid from 'date-fns/isValid';

import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';

import { DataGrid, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel, GridToolbar, GridValueFormatterParams } from '@mui/x-data-grid';
import { nlNL } from '@mui/x-data-grid/locales';

import { DocumentDocument } from '../../api/collection/documents';

import { useDateFormat } from '../../i18n/datetime';
import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

type Row = {
	encoding?: string,
	format?: string,
	kind?: string,
	datetime?: Date,
	identifier?: string,
	reference?: string,
	parsed?: boolean,
	patientName?: string,
	patientId?: string,
	anomalies?: number,
	status?: string,
	deleted?: boolean,
	lastVersion?: boolean
};

type Props = {
	items: DocumentDocument[]
};

const DocumentsTable = ({ items }: Props) => {

	const format = useDateFormat('PPP');

	const dateValueFormatter = useCallback(({value}: GridValueFormatterParams<Date>) => isValid(value) ? format(value) : value, [format]);

	const columns = useMemo((): GridColDef<Row>[] => [
		{ field: 'createdAt', headerName: 'Created at', flex: 1, valueFormatter: dateValueFormatter },
		{ field: 'encoding', headerName: 'Encoding', width: 50 },
		{ field: 'parsed', headerName: 'Parsed', width: 50 },
		{ field: 'format', headerName: 'Format', width: 90 },
		{ field: 'kind', headerName: 'Kind', width: 70 },
		{ field: 'datetime', headerName: 'Datetime', flex: 1, valueFormatter: dateValueFormatter },
		{ field: 'identifier', headerName: 'Identifier', flex: 1 },
		{ field: 'reference', headerName: 'Reference' },
		{ field: 'patientName', headerName: 'PatientName', flex: 1 },
		{ field: 'patientId', headerName: 'PatientId', width: 50 },
		{ field: 'anomalies', headerName: 'Anomalies', width: 30 },
		{
			field: 'status',
			headerName: 'Status',
			width: 50,
			renderCell: ({value}: GridRenderCellParams<string | undefined>) => {
				switch (value) {
					case undefined: return <></>;
					case 'complete': return <DoneIcon/>;
					case 'partial': return <HourglassEmptyIcon/>;
					default: return <QuestionMarkIcon/>;
				}
			}
		},
		{
			field: 'deleted',
			headerName: 'Deleted',
			width: 50,
			renderCell: ({value}: GridRenderCellParams<boolean>) => (
				value ? <DeleteIcon/> : <></>
			)
		},
		{
			field: 'lastVersion',
			headerName: 'LastVersion',
			width: 50,
			renderCell: ({value}: GridRenderCellParams<boolean>) => (
				value ? <></> : <HistoryIcon/>
			)
		},
	], [dateValueFormatter]);


	const rows = useMemo(() => items.map(({ _id, kind, format, encoding, parsed, patient, patientId, datetime, createdAt, reference, identifier, anomalies, status, deleted, lastVersion }) => ({
		id: _id,
		createdAt,
		encoding,
		parsed,
		format,
		kind,
		datetime,
		identifier,
		reference,
		patientName: parsed ? `${patient.lastname} ${patient.firstname}` : undefined,
		patientId,
		anomalies,
		status,
		deleted,
		lastVersion,
	})), [items]);

	const onSortModelChange = useCallback((sortModel: GridSortModel) => {
		console.debug({sortModel});
	}, []);

  const onFilterModelChange = useCallback((filterModel: GridFilterModel) => {
		console.debug({filterModel})
  }, []);


  const onPageChange = useCallback((newPage: number) => {
		console.debug({newPage})
  }, []);

	return (
		<Box sx={{ height: 720, width: '100%' }}>
			<DataGrid
				localeText={nlNL.components.MuiDataGrid.defaultProps.localeText}
				initialState={{
					columns: {
						columnVisibilityModel: {
							encoding: false,
							parsed: false,
						}
					},
					sorting: {
						sortModel: [
							{
								field: 'createdAt',
								sort: 'desc'
							}
						]
					}
				}}
				rows={rows}
				columns={columns}
				pageSize={10}
				rowsPerPageOptions={[10]}
				disableSelectionOnClick
				components={{
				  Toolbar: GridToolbar,
				}}
				experimentalFeatures={{ newEditingApi: true }}
				onSortModelChange={onSortModelChange}
				onFilterModelChange={onFilterModelChange}
				onPageChange={onPageChange}
			/>
		</Box>
	)
};

export default DocumentsTable;
