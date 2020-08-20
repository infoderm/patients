import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import {settings} from '../../api/settings.js';

// TODO validate should have three possible outcomes
//       1 valid input (sync)
//      -1 intermediate input (no sync, update, error/warning? label)
//       0 wrong input (no sync, no update)

const InputOneSetting = (props) => {
	const {
		className,
		loading,
		setting,
		sanitize,
		validate,
		value,
		label,
		title
	} = props;

	const [error, setError] = useState(false);

	useEffect(() => {
		const {outcome} = validate(value);
		setError(!outcome);
	}, [validate, value]);

	const onChange = (e) => {
		const newValue = sanitize(e.target.value);

		Meteor.call(settings.methods.update, setting, newValue, (err, _res) => {
			if (err) {
				console.error(err);
			} else {
				console.debug('Setting', setting, 'updated to', newValue);
			}
		});
	};

	return (
		<div className={className}>
			{title && <Typography variant="h4">{title}</Typography>}
			<TextField
				readOnly={loading}
				label={label}
				value={value}
				error={error}
				onChange={onChange}
			/>
		</div>
	);
};

InputOneSetting.propTypes = {
	title: PropTypes.string,
	label: PropTypes.string,
	sanitize: PropTypes.func,
	validate: PropTypes.func
};

InputOneSetting.defaultProps = {
	sanitize: (x) => x,
	validate: () => ({
		outcome: 1
	})
};

const Component = withTracker(({setting}) => {
	const handle = settings.subscribe(setting);
	return {
		loading: !handle.ready(),
		value: settings.get(setting)
	};
})(InputOneSetting);

Component.propTypes = {
	setting: PropTypes.string.isRequired
};

export default Component;
