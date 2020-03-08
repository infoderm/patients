import React, { useState } from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';

import dateFormat from 'date-fns/format';

import TagList from '../tags/TagList.js';

import BooksDownloadDialog from './BooksDownloadDialog.js';

import BookCard from './BookCard.js';
import { Books } from '../../api/books.js';

import YearJumper from '../navigation/YearJumper.js';

const styles = theme => ({
  saveButton: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(21),
  },
});

function BooksList ( { classes , match , year , page , perpage } ) {

  const [downloading, setDownloading] = useState(false) ;

  const now = new Date();
  page = match && match.params.page && parseInt(match.params.page,10) || page ;
  year = match && match.params.year || year || dateFormat(now, 'yyyy');

  const _year = parseInt(year, 10);

  const query = { fiscalYear: _year } ;

  const initialBegin = new Date(_year, 0, 1);

  return (
    <div>
      <YearJumper current={_year} toURL={x => `/books/${x}`}/>
      <TagList
        page={page}
        perpage={perpage}
        collection={Books}
        Card={BookCard}
        subscription="books"
        url={match.url}
        query={query}
        sort={{fiscalYear: 1, bookNumber: -1}}
      />
      <Fab className={classes.saveButton} color="secondary" onClick={e => setDownloading(true)}>
          <SaveIcon/>
      </Fab>
      <BooksDownloadDialog initialBegin={initialBegin} open={downloading} onClose={e => setDownloading(false)}/>
    </div>
  ) ;

}

BooksList.defaultProps = {
  page: 1,
  perpage: 10,
} ;

BooksList.propTypes = {
  year: PropTypes.string,
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;

export default withStyles(styles, { withTheme: true })(BooksList);
