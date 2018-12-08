import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  anomaly: {
    backgroundColor: '#fa8',
  },
  comment: {
    '& th' : {
      color: '#666 !important',
    },
    '& td' : {
      color: '#666 !important',
    },
  },
  row: {
  },
});

function HealthOneLabResultsTable(props) {
  const { classes , document } = props;

  const rows = [] ;

  for ( const result of document.results ) {
    let className = classes.row;
    if (result.flag === '*') className = classes.anomaly ;
    else if (result.flag === 'C') className = classes.comment ;
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
            <TableCell numeric>Line</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Measure</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Normal</TableCell>
            <TableCell>Flag</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            return (
              <TableRow key={i} className={row.className}>
                <TableCell numeric>{i}</TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.measure}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.normal}</TableCell>
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
