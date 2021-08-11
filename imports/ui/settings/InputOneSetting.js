import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import {useSetting} from '../../client/settings';

// TODO validate should have three possible outcomes
//       1 valid input (sync)
//      -1 intermediate input (no sync, update, error/warning? label)
//       0 wrong input (no sync, no update)

const InputOneSetting = (props) => {
	const {className, setting, sanitize, validate, label, title} = props;

	const {loading, value, setValue} = useSetting(setting);

	const [error, setError] = useState(false);

	useEffect(() => {
		const {outcome} = validate(value);
		setError(!outcome);
	}, [validate, value]);

	const onChange = (e) => {
		const newValue = sanitize(e.target.value);
		setValue(newValue);
	};

	return (
		<div className={className}>
			{title && <Typography variant="h4">{title}</Typography>}
			<TextField
				disabled={loading}
				label={label}
				value={value}
				error={error}
				onChange={onChange}
			/>
		</div>
	);
};

InputOneSetting.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	label: PropTypes.string,
	setting: PropTypes.string.isRequired,
	sanitize: PropTypes.func,
	validate: PropTypes.func,
};

InputOneSetting.defaultProps = {
	sanitize: (x) => x,
	validate: () => ({
		outcome: 1,
	}),
};

export default InputOneSetting;
