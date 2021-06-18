import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import {Drugs} from '../../api/drugs';

const styles = (theme) => ({
	container: {
		padding: theme.spacing(3)
	}
});

class DrugDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			drug: props.drug
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({drug: nextProps.drug});
	}

	render() {
		const {classes, loading} = this.props;
		const {drug} = this.state;

		if (loading) {
			return <Loading />;
		}

		if (!drug) {
			return <NoContent>Drug not found.</NoContent>;
		}

		return (
			<div>
				<div className={classes.container}>
					<pre>{JSON.stringify(drug, null, 4)}</pre>
				</div>
			</div>
		);
	}
}

DrugDetails.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withTracker(({match}) => {
	const _id = match.params.id;
	const handle = Meteor.subscribe('drug', _id);
	if (handle.ready()) {
		const drug = Drugs.findOne(_id);
		return {loading: false, drug};
	}

	return {loading: true};
})(withStyles(styles, {withTheme: true})(DrugDetails));
