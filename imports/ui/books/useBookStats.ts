import useConsultationsStats from '../consultations/useConsultationsStats';
import {type ConsultationDocument} from '../../api/collection/consultations';
import {books} from '../../api/books';

const useBookStats = (
	name: string,
	filter?: Mongo.Selector<ConsultationDocument>,
) =>
	useConsultationsStats({
		...books.selector(name),
		...filter,
	});

export default useBookStats;
