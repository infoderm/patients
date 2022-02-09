import React, {useMemo, useState} from 'react';
import ModalContext from './ModalContext';

let i = 0n;
const key = () => `${++i}`;

const ModalProvider = ({children}) => {
	// TODO use more efficient persistent data structure
	const [modals, setModals] = useState([]);

	const context = useMemo(() => {
		const append = (child: JSX.Element) => {
			setModals((previous) => previous.concat([child]));
		};

		const remove = (child: JSX.Element) => {
			setModals((previous) => previous.filter((x) => x !== child));
		};

		const replace = (target: JSX.Element, replacement: JSX.Element) => {
			setModals((previous) =>
				previous.map((x) => (x === target ? replacement : x)),
			);
		};

		return [append, replace, remove, key];
	}, [setModals]);

	return (
		<ModalContext.Provider value={context}>
			{children}
			{modals}
		</ModalContext.Provider>
	);
};

export default ModalProvider;
