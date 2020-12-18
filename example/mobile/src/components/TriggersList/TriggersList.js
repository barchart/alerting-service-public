import { useDispatch, useSelector } from 'react-redux';
import { List } from 'react-native-paper';
import React from 'react';

import { getManager } from '../../utils/AlertManager';
import { setTriggers } from '../../redux/actions/alerts';

const TriggersList = ({ triggers }) => {
	const userID = useSelector((state) => state.alerts.userID);
	const system = useSelector((state) => state.alerts.system);
	const dispatch = useDispatch();

	const updateTrigger = (userID, system, alertId, triggerDate, status) => {
		const manager = getManager();

		const triggerStatus = status === 'Read' ? 'Unread' : 'Read';

		if (manager) {
			// eslint-disable-next-line camelcase
			manager.updateTrigger({ alert_id: alertId, trigger_date: triggerDate, trigger_status: triggerStatus }).then(() => {
				// eslint-disable-next-line camelcase
				manager.retrieveTriggers({ user_id: userID, alert_system: system }).then((triggers) => {
					dispatch(setTriggers(triggers));
				});
			});
		}
	};

	return triggers.map((trigger) => {
		const date = new Date(+(trigger.trigger_date)).toLocaleString();
		const read = trigger.trigger_status === 'Read';

		return <List.Item
			key={trigger.trigger_date}
			title={trigger.trigger_title}
			description={`${date} - ${trigger.alert_id}`}
			titleNumberOfLines={2}
			left={(props) => <List.Icon {...props} icon={read ? 'checkbox-marked' : 'checkbox-blank-outline'}/>}
			onPress={() => {
				updateTrigger(userID, system, trigger.alert_id, trigger.trigger_date, trigger.trigger_status);
			}}
		/>;
	});
};

export default TriggersList;