import useConsultationsStats from '../consultations/useConsultationsStats';
import {type ConsultationDocument} from '../../api/collection/consultations';
import {books} from '../../api/books';
import type Filter from '../../api/query/Filter';

const useBookStats = (name?: string, filter?: Filter<ConsultationDocument>) =>
	useConsultationsStats(
		{
			...books.filter(name ?? ''),
			...filter,
		},
		name === undefined,
	);

export default useBookStats;
