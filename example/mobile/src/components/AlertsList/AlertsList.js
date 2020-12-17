import { List } from 'react-native-paper';
import React from 'react';
import { useDispatch } from 'react-redux';

import { getManager } from '../../utils/AlertManager';
import { setAlerts } from '../../redux/actions/alerts';

const AlertsList = ({ alerts }) => {
	const dispatch = useDispatch();

	const handleStart = (alert) => {
		const manager = getManager();
		
		let updateAlertStatus = Promise.resolve();

		if (manager) {
			if (alert.alert_state === 'Triggered' || alert.alert_state === 'Inactive') {
				// eslint-disable-next-line camelcase
				updateAlertStatus = manager.enableAlert({ alert_id: `${alert.alert_id}` });
			}
			
			if (alert.alert_state === 'Active') {
				// eslint-disable-next-line camelcase
				manager.disableAlert({ alert_id: `${alert.alert_id}` });
			}
			
			return updateAlertStatus.then(() => {
				// eslint-disable-next-line camelcase
				return manager.retrieveAlerts({ user_id: alert.user_id, alert_system: alert.alert_system })
					.then((alerts) => {
						dispatch(setAlerts(alerts));
					});
			}).catch(() => {});
		}
	};

	return alerts.map((alert) => {
		return (<List.Item
			key={alert.alert_id}
			title={alert.name}
			description={`${alert.alert_id} - ${alert.alert_state}`}
			onPress={() => handleStart(alert)}
		/>);
	});
};

export default AlertsList;