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
    backgroundColor: '#ddd',
  },
  row: {
  },
});

function SimpleTable(props) {
  const { classes , report } = props;

  const rows = [] ;

  for ( const result of report.results ) {
    for ( const line of result.lines ) {
      let className = classes.row;
      if (line.flag === '*') className = classes.anomaly ;
      else if (line.flag === 'C') className = classes.comment ;
      rows.push({
        className ,
        line: result.line,
        code: result.code,
        title: result.title,
        ...line,
      }) ;
    }
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell numeric>Line</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Index</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Measure</TableCell>
            <TableCell>Flag</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => {
            return (
              <TableRow key={row.line} className={row.className}>
                <TableCell numeric>{row.line}</TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                { row.flag === 'C' ? row.comment.length === 1 ?
                  <TableCell colSpan={3}>{row.comment[0]}</TableCell>
                  :
                  <React.Fragment>
                    <TableCell>{row.comment[0]}</TableCell>
                    <TableCell>{row.comment[1]}</TableCell>
                    <TableCell>{row.comment[2]}</TableCell>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <TableCell>{row.index}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.measure}</TableCell>
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

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
