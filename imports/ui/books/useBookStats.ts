import useConsultationsStats from '../consultations/useConsultationsStats';
import {type ConsultationDocument} from '../../api/collection/consultations';
import {books} from '../../api/books';
import type Selector from '../../api/Selector';

const useBookStats = (name: string, filter?: Selector<ConsultationDocument>) =>
	useConsultationsStats({
		...books.selector(name),
		...filter,
	});

export default useBookStats;
