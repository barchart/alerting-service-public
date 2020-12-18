import { combineReducers } from 'redux';

import alertsReducer from './alerts';

export default combineReducers({
	alerts: alertsReducer
});