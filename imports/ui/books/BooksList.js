import React from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';

import TagList from '../tags/TagList.js';

import BooksDownloadDialog from './BooksDownloadDialog.js';

import BookCard from './BookCard.js';
import { Books } from '../../api/books.js';

const styles = theme => ({
  saveButton: {
      position: 'fixed',
      bottom: theme.spacing.unit * 3,
      right: theme.spacing.unit * 21,
  },
});

class BooksList extends React.Component {

  constructor ( props ) {
    super(props);
    this.state = {
      downloading: false ,
    } ;
  }

  render ( ) {

    let { classes , match , page , perpage } = this.props ;

    page = match && match.params.page && parseInt(match.params.page,10) || page ;

    return (
      <div>
        <TagList
          page={page}
          perpage={perpage}
          collection={Books}
          Card={BookCard}
          subscription="books"
          root="/books"
        />
        <Fab className={classes.saveButton} color="secondary" onClick={e => this.setState({ downloading: true})}>
            <SaveIcon/>
        </Fab>
        <BooksDownloadDialog open={this.state.downloading} onClose={e => this.setState({ downloading: false})}/>
      </div>
    ) ;

  }

}

BooksList.defaultProps = {
  page: 0,
  perpage: 10,
} ;

BooksList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;

export default withStyles(styles, { withTheme: true })(BooksList);
