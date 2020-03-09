import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React, {Fragment} from 'react' ;

import { Link } from 'react-router-dom'

import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';
import Paginator from '../navigation/Paginator.js';

function TagList ( props ) {

  const { loading , tags , page , perpage , collection , Card , root , url } = props;

  const _root = root || url.split('/page/')[0];

  return (
    <Fragment>
      <div>
        { loading ?
            <Loading/>
            : tags.length ?
            <Grid container spacing={3}>
              { tags.map(tag => ( <Card key={tag._id} item={tag}/> )) }
            </Grid>
            :
            <NoContent>{`Nothing to see on page ${page}.`}</NoContent>
        }
      </div>
      <Paginator page={page} end={tags.length < perpage} root={_root}/>
    </Fragment>
  ) ;
}

TagList.defaultProps = {
  page: 1,
  perpage: 10,
  query: {},
  sort: { name: 1 },
} ;

TagList.propTypes = {

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
}) ( TagList );
