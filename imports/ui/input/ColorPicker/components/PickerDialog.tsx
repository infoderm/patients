import React from 'react';
import {ChromePicker, type Color, type ColorChangeHandler} from 'react-color';

type Props = {
	value: Color;
	onChange: ColorChangeHandler;
	onClick: () => void;
};

const PickerDialog = ({value, onClick, onChange}: Props) => (
	<div style={{position: 'absolute', zIndex: 2}}>
		<div
			style={{
				position: 'fixed',
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '0px',
			}}
			onClick={onClick}
		/>
		<ChromePicker color={value} onChange={onChange} />
	</div>
);

export default PickerDialog;
