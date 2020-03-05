import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  anomalyRow: {
    backgroundColor: '#fa8',
  },
  headerRow: {
    backgroundColor: '#ddd',
  },
  subheaderRow: {
    backgroundColor: '#eee',
  },
  endRow: {
    '& th' : {
      color: '#666 !important',
    },
    '& td' : {
      color: '#666 !important',
    },
  },
  commentRow: {
    '& th' : {
      color: '#666 !important',
    },
    '& td' : {
      color: '#666 !important',
    },
  },
  row: {
  },
  normalCell: {
    color: '#444',
  },
});

function HealthOneLabResultsTable(props) {
  const { classes , document } = props;

  if (!document.results || document.results.length === 0) {
    return (
      <Typography>No results</Typography>
    ) ;
  }

  const rows = [] ;

  for ( const result of document.results ) {
    let className = classes.row;
    if (result.flag === '*') className = classes.anomalyRow ;
    else if (result.flag === 'C') className = classes.commentRow ;
    else if (result.code && result.code.startsWith('t_')) {
      if (result.name && result.name.match(/^[A-Z ]*$/)) {
        className = classes.headerRow ;
      }
      else {
        className = classes.subheaderRow ;
      }
    }
    else if (result.code === 'TEXTEF') className = classes.endRow ;
    rows.push({
      className,
      ...result,
    }) ;
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
                {isResult && <TableCell component="th" scope="row">
                  {row.name === 'COMMENTAIRES' ? '' : row.name}
                </TableCell>}
                {!isResult && <TableCell component="th" scope="row" colSpan={2}>
                  {row.name}
                </TableCell>}
                { row.flag === 'C' || row.code === 'TEXTEF' ? comment.length != 3 ?
                  <TableCell colSpan={3}>{row.measure}</TableCell>
                  :
                  <React.Fragment>
                    <TableCell>{comment[0]}</TableCell>
                    <TableCell align="left">{comment[1]}</TableCell>
                    <TableCell align="left">{comment[2]}</TableCell>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell align="left">{row.measure}</TableCell>
                    <TableCell className={classes.normalCell} align="left">{row.normal}</TableCell>
                  </React.Fragment>
                }
                <TableCell>{row.flag}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

HealthOneLabResultsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HealthOneLabResultsTable);
