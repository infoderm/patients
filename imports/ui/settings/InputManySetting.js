import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import SetPicker from '../input/SetPicker.js';

import Typography from '@material-ui/core/Typography';

import {settings, useSetting} from '../../client/settings.js';

const InputManySetting = (props) => {

	const {
		className,
		setting,
		title,
		label,
		makeSuggestions,
		placeholder,
		...rest
	} = props;

	const onChange = (e) => {
		const newValue = e.target.value;

		Meteor.call(settings.methods.update, setting, newValue, (err, _res) => {
			if (err) {
				console.error(err);
			} else {
				console.debug('Setting', setting, 'updated to', newValue);
			}
		});
	};

	const {loading, value} = useSetting(setting);
	console.debug({loading, value});

	return (
		<div className={className}>
			<Typography variant="h4">{title}</Typography>
			<SetPicker
				readOnly={loading}
				useSuggestions={makeSuggestions(value)}
				itemToKey={(x) => x}
				itemToString={(x) => x}
				createNewItem={(x) => x}
				inputTransform={(x) => x}
				TextFieldProps={{
					label,
					margin: 'normal'
				}}
				value={value}
				placeholder={loading ? 'loading...' : placeholder}
				onChange={onChange}
				{...rest}
			/>
		</div>
	);
};

InputManySetting.defaultProps = {
	makeSuggestions: () => () => ({results: []}),
	label: undefined
};

InputManySetting.propTypes = {
	setting: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	makeSuggestions: PropTypes.func,
	label: PropTypes.string
};

export default InputManySetting;
