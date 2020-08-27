import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import {settings} from '../../client/settings.js';

import ValuePicker from '../input/ValuePicker.js';

class SelectOneSetting extends React.Component {
	onChange = (e) => {
		const {setting} = this.props;

		const newValue = e.target.value;

		Meteor.call(settings.methods.update, setting, newValue, (err, _res) => {
			if (err) {
				console.error(err);
			} else {
				console.debug('Setting', setting, 'updated to', newValue);
			}
		});
	};

	render() {
		const {
			className,
			loading,
			value,
			options,
			optionToString,
			label,
			title
		} = this.props;

		return (
			<div className={className}>
				{title && <Typography variant="h4">{title}</Typography>}
				<ValuePicker
					readOnly={loading}
					options={options}
					optionToString={optionToString}
					label={label}
					value={value}
					onChange={this.onChange}
				/>
			</div>
		);
	}

	static propTypes = {
		title: PropTypes.string,
		label: PropTypes.string,
		options: PropTypes.array.isRequired,
		optionToString: PropTypes.func
	};
}

const Component = withTracker(({setting}) => {
	const handle = settings.subscribe(setting);
	return {
		loading: !handle.ready(),
		value: settings.get(setting)
	};
})(SelectOneSetting);

Component.propTypes = {
	setting: PropTypes.string.isRequired
};

export default Component;
