import byWeek from '../routes/byWeek';

import PreconfiguredWeeklyPlanner from './PreconfiguredWeeklyPlanner';

const WeeklyPlannerRoutes = byWeek(PreconfiguredWeeklyPlanner);

export default WeeklyPlannerRoutes;
