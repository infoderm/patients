import React, {useMemo} from 'react';

import {filter} from '@iterable-iterator/filter';
import {sorted} from '@iterable-iterator/sorted';

import {key} from '@total-order/key';
import {increasing} from '@total-order/primitive';

import {type PaymentMethod} from '../../api/collection/consultations';

import InputManySetting from './InputManySetting';

const options = ['cash', 'wire', 'third-party'];

type Props = {
	readonly className?: string;
};

const SyncPaidSetting = ({className}: Props) => {
	const optionToString = (option: PaymentMethod) => option;

	const compare = useMemo(
		() => key(increasing, (x: PaymentMethod) => options.indexOf(x)),
		[options],
	);

	const sort = useMemo(
		() => (items: PaymentMethod[]) => items.slice().sort(compare),
		[compare],
	);

	const makeSuggestions = (value: PaymentMethod[]) => (inputValue: string) => ({
		results: sorted(
			compare,
			filter(
				(i: PaymentMethod) =>
					!value.includes(i) &&
					i.toLowerCase().startsWith(inputValue.toLowerCase()),
				options,
			),
		),
	});

	return (
		<InputManySetting
			className={className}
			label="Paid synchronization"
			setting="consultations-paid-sync"
			itemToString={optionToString}
			createNewItem={undefined}
			makeSuggestions={makeSuggestions}
			sort={sort}
		/>
	);
};

export default SyncPaidSetting;
