import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, createStyles} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = (theme) =>
	createStyles({
		root: {
			maxWidth: 1200,
			margin: '0 auto',
			marginTop: theme.spacing(3),
			overflowX: 'auto'
		},
		table: {
			minWidth: 700
		},
		anomalyRow: {
			backgroundColor: '#fa8'
		},
		unknownFlagRow: {
			backgroundColor: '#f8a'
		},
		headerRow: {
			backgroundColor: '#ddd'
		},
		subheaderRow: {
			backgroundColor: '#eee'
		},
		endRow: {
			'& th': {
				color: '#666 !important'
			},
			'& td': {
				color: '#666 !important'
			}
		},
		commentRow: {
			'& th': {
				color: '#666 !important'
			},
			'& td': {
				color: '#666 !important'
			}
		},
		row: {},
		normalCell: {
			color: '#444'
		}
	});

const useStyles = makeStyles(styles);

const HealthOneLabResultsTable = ({document}) => {
	const classes = useStyles();

	if (!document.results || document.results.length === 0) {
		return <Typography>No results</Typography>;
	}

	const rows = [];

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
				} else if (result.code && result.code.startsWith('t_')) {
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
			...result
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
						const isResult = row.code && row.code.match(/^\d+$/);
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

HealthOneLabResultsTable.propTypes = {
	document: PropTypes.object.isRequired
};

export default HealthOneLabResultsTable;
