import React from 'react';
import {makeStyles, createStyles} from '@mui/styles';

import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {DocumentDocument, DocumentResult} from '../../api/collection/documents';

const styles = (theme) =>
	createStyles({
		root: {
			maxWidth: 1200,
			margin: '0 auto',
			marginTop: theme.spacing(3),
			overflowX: 'auto',
		},
		table: {
			minWidth: 700,
		},
		anomalyRow: {
			backgroundColor: '#fa8',
		},
		unknownFlagRow: {
			backgroundColor: '#f8a',
		},
		headerRow: {
			backgroundColor: '#ddd',
		},
		subheaderRow: {
			backgroundColor: '#eee',
		},
		endRow: {
			'& th': {
				color: '#666 !important',
			},
			'& td': {
				color: '#666 !important',
			},
		},
		commentRow: {
			'& th': {
				color: '#666 !important',
			},
			'& td': {
				color: '#666 !important',
			},
		},
		row: {},
		normalCell: {
			color: '#444',
		},
	});

const useStyles = makeStyles(styles);

interface HealthOneLabResultsTableProps {
	document: DocumentDocument;
}

const HealthOneLabResultsTable = ({
	document,
}: HealthOneLabResultsTableProps) => {
	const classes = useStyles();

	if (!document.results || document.results.length === 0) {
		return <Typography>No results</Typography>;
	}

	const rows: Array<DocumentResult & {className: string}> = [];

	for (const result of document.results) {
		let className = classes.row;
		switch (result.flag) {
			case '*': {
				className = classes.anomalyRow;

				break;
			}

			case '+': {
				className = classes.anomalyRow;

				break;
			}

			case '++': {
				className = classes.anomalyRow;

				break;
			}

			case '-': {
				className = classes.anomalyRow;

				break;
			}

			case '--': {
				className = classes.anomalyRow;

				break;
			}

			case 'C': {
				className = classes.commentRow;

				break;
			}

			default:
				if (result.flag !== '') {
					className = classes.unknownFlagRow;
				} else if (result.code?.startsWith('t_')) {
					className =
						result.name && /^[A-Z ]*$/.test(result.name)
							? classes.headerRow
							: classes.subheaderRow;
				} else
					switch (result.code) {
						case 'CORCOP': {
							className = classes.commentRow;

							break;
						}

						case 'TITRE': {
							if (result.name === '') {
								continue;
							}

							className = classes.headerRow;

							break;
						}

						case 'TEXTEF': {
							className = classes.endRow;

							break;
						}
						// No default
					}
		}

		rows.push({
			className,
			...result,
		});
	}

	return (
		<Paper className={classes.root}>
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell align="left">Code</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>Unit</TableCell>
						<TableCell align="left">Measure</TableCell>
						<TableCell align="left">Normal</TableCell>
						<TableCell>Flag</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row, i) => {
						const isResult = /^\d+$/.exec(row.code);
						const comment = row.measure ? row.measure.split('\t') : [];
						comment.pop();
						return (
							<TableRow key={i} className={row.className}>
								{isResult && <TableCell align="left">{row.code}</TableCell>}
								{isResult && (
									<TableCell component="th" scope="row">
										{row.name === 'COMMENTAIRES' ? '' : row.name}
									</TableCell>
								)}
								{!isResult && (
									<TableCell component="th" scope="row" colSpan={2}>
										{row.name}
									</TableCell>
								)}
								{row.flag === 'C' || row.code === 'TEXTEF' ? (
									comment.length === 3 ? (
										<>
											<TableCell>{comment[0]}</TableCell>
											<TableCell align="left">{comment[1]}</TableCell>
											<TableCell align="left">{comment[2]}</TableCell>
										</>
									) : (
										<TableCell colSpan={3}>{row.measure}</TableCell>
									)
								) : (
									<>
										<TableCell>{row.unit}</TableCell>
										<TableCell align="left">{row.measure}</TableCell>
										<TableCell className={classes.normalCell} align="left">
											{row.normal}
										</TableCell>
									</>
								)}
								<TableCell>{row.flag}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</Paper>
	);
};

export default HealthOneLabResultsTable;
