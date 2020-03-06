import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import PropTypes from 'prop-types';

import { Consultations } from '../../api/consultations.js';

import PagedConsultationsList from './PagedConsultationsList.js';

function ConsultationPager ( props ) {

  const { loading , page , perpage , root , url , items , itemProps } = props;

  const _root = root || url.split('/page/')[0];

  return (
    <PagedConsultationsList
      loading={loading}
      root={_root}
      page={page}
      perpage={perpage}
      items={items}
      itemProps={itemProps}
    />
  ) ;
}

ConsultationPager.defaultProps = {
  page: 1,
  perpage: 10,
  query: {},
} ;

ConsultationPager.propTypes = {

  root: PropTypes.string,
  url: PropTypes.string,
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,

  query: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,

  loading: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  itemProps: PropTypes.object,

};

export default withTracker(({query, sort, page, perpage}) => {
  const handle = Meteor.subscribe('consultations', query);
  return {
    loading: !handle.ready() ,
    items: Consultations.find(query, {sort, skip: (page-1)*perpage, limit: perpage}).fetch() ,
  } ;
}) ( ConsultationPager );
