import React, {useEffect} from 'react';
import {ChromePicker, type Color, type ColorChangeHandler} from 'react-color';

type Props = {
	readonly value: Color;
	readonly onChange: ColorChangeHandler;
	readonly onClose: () => void;
};

const _isTextBox = (
	element: Element | null,
): element is HTMLInputElement | HTMLTextAreaElement => {
	return element?.tagName.match(/input|textarea/i) !== null;
};

const PickerDialog = ({value, onClose, onChange}: Props) => {
	useEffect(() => {
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;

			// NOTE: Ignore keys pressed when inside a text box.
			const {activeElement} = document;
			if (event.target === activeElement && _isTextBox(activeElement)) return;

			event.stopPropagation();
			onClose();
		};

		document.addEventListener('keydown', closeOnEscape);
		return () => {
			document.removeEventListener('keydown', closeOnEscape);
		};
	}, [onClose]);

	return (
		<div style={{position: 'absolute', zIndex: 2}}>
			<div
				style={{
					position: 'fixed',
					top: '0px',
					right: '0px',
					bottom: '0px',
					left: '0px',
				}}
				onClick={onClose}
			/>
			<ChromePicker color={value} onChange={onChange} />
		</div>
	);
};

export default PickerDialog;
