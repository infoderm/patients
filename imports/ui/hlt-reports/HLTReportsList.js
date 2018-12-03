import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { HLTReports } from '../../api/hlt-reports.js' ;

import HLTReportCard from './HLTReportCard.js';

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

function HLTReportsList ( { page , perpage , reports } ) {
	return (
      <div>
        <div>
          { reports.map(report => ( <HLTReportCard key={report._id} report={report}/> )) }
        </div>
        { page === 0 ? null :
        <Button variant="fab" className={classes.fabprev} color="primary" component={Link} to={`hlt-reports/page/${page-1}`}>
            <NavigateBeforeIcon/>
        </Button> }
        { reports.length < perpage ? null :
        <Button variant="fab" className={classes.fabnext} color="primary" component={Link} to={`hlt-reports/page/${page+1}`}>
            <NavigateNextIcon/>
        </Button> }
      </div>
	) ;
}

HLTReportsList.defaultProps = {
  page: 0,
  perpage: 10,
} ;

HLTReportsList.propTypes = {
  page: PropTypes.number.isRequired,
  perpage: PropTypes.number.isRequired,
} ;

export default withTracker(({match, page, perpage}) => {
  page = match && match.params.page && parseInt(match.params.page,10) || page ;
  Meteor.subscribe('hlt-reports');
  return {
    reports: HLTReports.find({}, {sort: { createdAt: -1 }, skip: page*perpage, limit: perpage}).fetch() ,
  } ;
}) ( withStyles(styles, { withTheme: true })(HLTReportsList) );
