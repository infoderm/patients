import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import {useSetting} from '../../client/settings';

import ValuePicker from '../input/ValuePicker';

const SelectOneSetting = (props) => {
	const {className, setting, options, optionToString, label, title} = props;

	const {loading, value, setValue} = useSetting(setting);

	const onChange = (e) => {
		const newValue = e.target.value;
		setValue(newValue);
	};

	return (
		<div className={className}>
			{title && <Typography variant="h4">{title}</Typography>}
			<ValuePicker
				readOnly={loading}
				options={options}
				optionToString={optionToString}
				label={label}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

SelectOneSetting.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	label: PropTypes.string,
	setting: PropTypes.string.isRequired,
	options: PropTypes.array.isRequired,
	optionToString: PropTypes.func,
};

export default SelectOneSetting;
