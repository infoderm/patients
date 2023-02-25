import type PropsOf from '../../lib/types/PropsOf';

type CardPatientProjection<C> = PropsOf<C> extends {patient: infer P} ? P : {};

export default CardPatientProjection;
