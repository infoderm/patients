import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

const MAGIC = '8j98ewu-datalist-for-MeteorSimpleAutoCompleteTextField';
let nextDatalistId = 0;

class MeteorSimpleAutoCompleteTextField extends React.Component {
	state = {
		datalistId: `${MAGIC}-#${++nextDatalistId}`
	};

	static propTypes = {
		subscription: PropTypes.string.isRequired,
		collection: PropTypes.object.isRequired,
		selector: PropTypes.object.isRequired,
		results: PropTypes.array.isRequired,
		stringify: PropTypes.func.isRequired
	};

	render() {
		const {inputProps, textFieldProps, results, stringify} = this.props;
		const {datalistId} = this.state;

		return (
			<div>
				<TextField
					inputProps={{
						list: datalistId,
						...inputProps
					}}
					{...textFieldProps}
				/>
				<datalist id={datalistId}>
					{results.map((result) => (
						<option key={result._id} value={stringify(result)} />
					))}
				</datalist>
			</div>
		);
	}
}

export default withTracker(({subscription, collection, selector, options}) => {
	Meteor.subscribe(subscription);
	return {
		results: collection.find(selector, options).fetch()
	};
})(MeteorSimpleAutoCompleteTextField);
