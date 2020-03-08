import { Meteor } from 'meteor/meteor' ;

import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import startOfYear from 'date-fns/startOfYear';
import endOfYear from 'date-fns/endOfYear';
import dateFormat from 'date-fns/format' ;
import addYears from 'date-fns/addYears';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { DatePicker } from "@material-ui/pickers";

import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TuneIcon from '@material-ui/icons/Tune';

import saveTextAs from '../../client/saveTextAs.js';

import { books } from '../../api/books.js';

const useStyles = makeStyles(theme => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
})) ;

export default function BooksDownloadDialog ( { open, onClose, initialAdvancedFunctionality, initialBegin, initialEnd } ) {

  const classes = useStyles();

  const [advancedFunctionality, setAdvancedFunctionality] = useState(initialAdvancedFunctionality);
  const [begin, setBegin] = useState(initialBegin);
  const [end, setEnd] = useState(initialEnd || addYears(initialBegin, 1));
  const [firstBook, setFirstBook] = useState(''+books.DOWNLOAD_FIRST_BOOK);
  const [lastBook, setLastBook] = useState(''+books.DOWNLOAD_LAST_BOOK);
  const [maxRows, setMaxRows] = useState(''+books.DOWNLOAD_MAX_ROWS);

  const setYear = year => {
    const newBegin = new Date(year, 0, 1);
    const newEnd = addYears(newBegin, 1);
    setBegin(newBegin);
    setEnd(newEnd);
  } ;

  useEffect(
    () => {
      setAdvancedFunctionality(initialAdvancedFunctionality);
      setBegin(initialBegin);
      setEnd(initialEnd || addYears(initialBegin, 1));
      setFirstBook(''+books.DOWNLOAD_FIRST_BOOK);
      setLastBook(''+books.DOWNLOAD_LAST_BOOK);
      setMaxRows(''+books.DOWNLOAD_MAX_ROWS);
    } ,
    [initialAdvancedFunctionality, initialBegin, initialEnd]
  ) ;

  const downloadData = event => {
    event.preventDefault();
    const _firstBook = parseInt(firstBook, 10);
    const _lastBook = parseInt(lastBook, 10);
    const _maxRows = parseInt(maxRows, 10);
    Meteor.call('books.interval.csv', begin, end, _firstBook, _lastBook, _maxRows , (err, res) => {
      if ( err ) console.error( err ) ;
      else {
	const filename = advancedFunctionality ? 'carnets.csv' : `carnets-${begin.getFullYear()}.csv`;
	saveTextAs(res, filename);
	onClose();
      }
    });
  };

  return (
      <Dialog
	open={open}
	onClose={onClose}
	component="form"
	aria-labelledby="books-download-dialog-title"
      >
	<DialogTitle id="books-download-dialog-title">Download book data as CSV</DialogTitle>
	<DialogContent>
	  <DialogContentText>
	    {advancedFunctionality ? "Tune parameters" : "Choose year"} then click download.
	  </DialogContentText>
	  { advancedFunctionality ?
	  <Fragment>
	    <div>
	    <DatePicker
	      label="Begin"
	      value={begin}
	      onChange={date => setBegin(date)}
	    />
	    </div>
	    <div>
	    <DatePicker
	      label="End"
	      value={end}
	      onChange={date => setEnd(date)}
	    />
	    </div>
	    <div>
	      <TextField
		label="First book"
		value={firstBook}
		onChange={e => setFirstBook(e.target.value)}
		error={!/^\d+$/.test(firstBook)}
	      />
	    </div>
	    <div>
	      <TextField
		label="Last book"
		value={lastBook}
		onChange={e => setLastBook(e.target.value)}
		error={!/^\d+$/.test(lastBook)}
	      />
	    </div>
	    <div>
	      <TextField
		label="Max rows"
		value={maxRows}
		onChange={e => setMaxRows(e.target.value)}
		error={!/^\d+$/.test(maxRows)}
	      />
	    </div>
	  </Fragment>
	  :
	  <div>
	  <DatePicker
	    views={["year"]}
	    label="Year"
	    value={begin}
	    onChange={date => setYear(date.getFullYear())}
	  />
	  </div>
	  }
	</DialogContent>
	<DialogActions>
	  <Button type="submit" onClick={onClose} color="default">
	    Cancel
	    <CancelIcon className={classes.rightIcon}/>
	  </Button>
	  {<Button onClick={e => setAdvancedFunctionality(true)} disabled={advancedFunctionality} color="default">
	    Advanced
	    <TuneIcon className={classes.rightIcon}/>
	  </Button>}
	  <Button onClick={downloadData} color="primary">
	    Download
	    <SaveIcon className={classes.rightIcon}/>
	  </Button>
	</DialogActions>
      </Dialog>
  );

}

BooksDownloadDialog.defaultProps = {
  initialAdvancedFunctionality: false,
} ;

BooksDownloadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialBegin: PropTypes.instanceOf(Date).isRequired,
  initialEnd: PropTypes.instanceOf(Date),
} ;
