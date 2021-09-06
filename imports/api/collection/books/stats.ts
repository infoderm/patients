import {Mongo} from 'meteor/mongo';

import {STATS_SUFFIX} from '../../createTagCollection';

import {collection} from '../books';
import {ConsultationsStats} from '../consultations/stats';

export const stats = collection + STATS_SUFFIX;
export const Stats = new Mongo.Collection<ConsultationsStats>(stats);
