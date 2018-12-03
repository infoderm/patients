import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const styles = theme => ({
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
    const { tags , classes , page , perpage , collection , Card , root } = this.props;
    return (
      <div>
        <Grid container spacing={24}>
          { tags.map(tag => ( <Card key={tag._id} item={tag}/> )) }
        </Grid>
        { page === 0 ? '' :
        <Button variant="fab" className={classes.fabprev} color="primary" component={Link} to={`${root}/page/${page-1}`}>
            <NavigateBeforeIcon/>
        </Button> }
        { tags.length < perpage ? '' :
        <Button variant="fab" className={classes.fabnext} color="primary" component={Link} to={`${root}/page/${page+1}`}>
            <NavigateNextIcon/>
        </Button> }
      </div>
    ) ;
  }

}

TagList.defaultProps = {
  page: 0,
  perpage: 10,
} ;

TagList.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,

  Card: PropTypes.func.isRequired,
  root: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,

  subscription: PropTypes.string.isRequired,
  collection: PropTypes.object.isRequired,

  tags: PropTypes.array.isRequired,
};

export default withTracker(({subscription, collection, page, perpage}) => {
  Meteor.subscribe(subscription);
  return {
    tags: collection.find({}, {sort: { name: 1 }, skip: page*perpage, limit: perpage}).fetch() ,
  } ;
}) ( withStyles(styles, { withTheme: true })(TagList) );
