import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import Loading from '../navigation/Loading.js';

const styles = theme => ({
  empty: {
    textAlign: 'center',
    margin: '3em 0',
    color: '#999',
  },
  fabprev: {
      position: 'fixed',
      bottom: theme.spacing.unit * 3,
      right: theme.spacing.unit * 12,
  },
  fabnext: {
      position: 'fixed',
      bottom: theme.spacing.unit * 3,
      right: theme.spacing.unit * 3,
  },
});

class TagList extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const { loading , tags , classes , page , perpage , collection , Card , root , url } = this.props;

    const _root = root || url.split('/page/')[0];

    return (
      <div>
        { loading ?
            <Loading/>
            : tags.length ?
            <Grid container spacing={24}>
              { tags.map(tag => ( <Card key={tag._id} item={tag}/> )) }
            </Grid>
            :
            <Typography className={classes.empty} variant="h3">{`Nothing to see on page ${page}.`}</Typography>
        }
        { page === 1 ? '' :
        <Fab className={classes.fabprev} color="primary" component={Link} to={`${_root}/page/${page-1}`}>
            <NavigateBeforeIcon/>
        </Fab> }
        { tags.length < perpage ? '' :
        <Fab className={classes.fabnext} color="primary" component={Link} to={`${_root}/page/${page+1}`}>
            <NavigateNextIcon/>
        </Fab> }
      </div>
    ) ;
  }

}

TagList.defaultProps = {
  page: 1,
  perpage: 10,
  query: {},
  sort: { name: 1 },
} ;

TagList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,

  Card: PropTypes.func.isRequired,
  root: PropTypes.string,
  url: PropTypes.string,
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,

  query: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,

  subscription: PropTypes.string.isRequired,
  collection: PropTypes.object.isRequired,

  tags: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default withTracker(({subscription, collection, query, sort, page, perpage}) => {
  const handle = Meteor.subscribe(subscription, query);
  return {
    loading: !handle.ready() ,
    tags: collection.find(query, {sort, skip: (page-1)*perpage, limit: perpage}).fetch() ,
  } ;
}) ( withStyles(styles, { withTheme: true })(TagList) );
