const INITIAL_STATE = {
	alerts: [],
	triggers: [],
	userID: '00000000',
	system: 'barchart.com'
};

const alertsReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_ALERTS': {
			return { ...state, alerts: action.payload };
		}
		case 'SET_TRIGGERS': {
			return { ...state, triggers: action.payload };
		}
		case 'SET_USER': {
			return { ...state, userID: action.payload };
		}
		case 'SET_SYSTEM': {
			return { ...state, system: action.payload };
		}
		default:
			return state;
	}
};

export default alertsReducer; 