import React, { useState } from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';

import dateFormat from 'date-fns/format';

import { list } from '@aureooms/js-itertools' ;
import { range } from '@aureooms/js-itertools' ;

import TagList from '../tags/TagList.js';

import BooksDownloadDialog from './BooksDownloadDialog.js';

import BookCard from './BookCard.js';
import { Books } from '../../api/books.js';

import Jumper from '../navigation/Jumper.js';

const styles = theme => ({
  saveButton: {
      position: 'fixed',
      bottom: theme.spacing.unit * 3,
      right: theme.spacing.unit * 21,
  },
});

function BooksList ( { classes , match , year , page , perpage } ) {

  const [downloading, setDownloading] = useState(false) ;

  const now = new Date();
  page = match && match.params.page && parseInt(match.params.page,10) || page ;
  year = match && match.params.year || year || dateFormat(now, 'YYYY');

  const _year = parseInt(year, 10);
  const _thisyear = now.getFullYear();

  const name = { $regex: '^' + year, $options: 'i' } ;

  const end = Math.min(_thisyear, _year + 5) + 1;
  const begin = end - 11;

  const years = list(range(begin, end)).map(
    x => ({
      key: x,
      url: `/books/${x}`,
      disabled: x === _year,
    })
  );

  return (
    <div>
      <Jumper items={years}/>
      <TagList
        page={page}
        perpage={perpage}
        collection={Books}
        Card={BookCard}
        subscription="books"
        url={match.url}
        name={name}
        sort={{name: -1}}
      />
      <Fab className={classes.saveButton} color="secondary" onClick={e => setDownloading(true)}>
          <SaveIcon/>
      </Fab>
      <BooksDownloadDialog initialYear={year} open={downloading} onClose={e => setDownloading(false)}/>
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
