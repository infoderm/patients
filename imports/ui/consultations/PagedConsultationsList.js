import React from 'react' ;

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Loading from '../navigation/Loading.js';
import Paginator from '../navigation/Paginator.js';
import NoContent from '../navigation/NoContent.js';

import ConsultationsList from './ConsultationsList.js';

export default function PagedConsultationsList ( props ) {

  const { root , loading , page , perpage , items , itemProps , ...rest } = props;

  return (
    <div>
      { loading ?
          <Loading/>
          : items.length ?
          <ConsultationsList items={items} itemProps={itemProps} {...rest}/>
          :
          <NoContent>{`Nothing to see on page ${page}.`}</NoContent>
      }
      <Paginator page={page} end={items.length < perpage} root={root}/>
    </div>
  ) ;
}

PagedConsultationsList.defaultProps = {
  loading: false,
} ;

PagedConsultationsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  root: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
};
