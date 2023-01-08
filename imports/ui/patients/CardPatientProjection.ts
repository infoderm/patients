import type PropsOf from '../../util/PropsOf';

type CardPatientProjection<C> = PropsOf<C> extends {patient: infer P} ? P : {};

export default CardPatientProjection;
