/* eslint-disable camelcase */
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-native-paper';

import { setAlerts, setTriggers } from '../../redux/actions/alerts';
import { getManager } from '../../utils/AlertManager';

export const HomeScreen = ({ navigation }) => {
	const alerts = useSelector((state) => state.alerts.alerts);
	const triggers = useSelector((state) => state.alerts.triggers);
	const pushNotifications = useSelector((state) => state.alerts.push);
	const userID = useSelector((state) => state.alerts.userID);
	const system = useSelector((state) => state.alerts.system);
	const dispatch = useDispatch();

	const manager = getManager();

	const handleSubscribeTriggers = useCallback(() => {
		manager.retrieveTriggers({ user_id: `${userID}`, alert_system: system }).then((triggers) => {
			dispatch(setTriggers(triggers));
		});
	}, [userID, system, manager, dispatch]);

	const handleSubscribeAlerts = useCallback(() => {
		manager.retrieveAlerts({ user_id: `${userID}`, alert_system: system }).then((alerts) => {
			dispatch(setAlerts(alerts));
		});
	}, [userID, system, manager, dispatch]);

	useEffect(() => {
		const disposables = [];

		if (manager) {
			disposables.push(manager.subscribeTriggers({ user_id: userID, alert_system: system }, handleSubscribeTriggers, handleSubscribeTriggers, handleSubscribeTriggers));
			disposables.push(manager.subscribeAlerts({ user_id: userID, alert_system: system }, handleSubscribeAlerts, handleSubscribeAlerts, handleSubscribeAlerts, handleSubscribeTriggers));
		}

		return () => {
			disposables.forEach((d) => d.dispose());
		};
	}, []);

	return (
		<View style={styles.container}>
			<View style={{ width: '100%', marginBottom: 10 }}>
				<Button
					title="Alerts"
					mode="contained"
					icon="format-list-bulleted"
					labelStyle={{ color: 'white' }}
					onPress={() => navigation.navigate('Alerts', { alerts: alerts })}
					style={{ marginBottom: 10 }}
				>
					Alerts ({alerts.length})
				</Button>
				<Button
					title="Triggered Alerts"
					mode="contained"
					icon="alert-circle-check"
					labelStyle={{ color: 'white' }}
					onPress={() => navigation.navigate({ name: 'Triggered' })}
					style={{ marginBottom: 10 }}
				>
					Triggered Alerts ({triggers.length})
				</Button>
				<Button
					title="Latest Push Notifications"
					mode="contained"
					icon="bell"
					labelStyle={{ color: 'white' }}
					onPress={() => navigation.navigate({ name: 'Push' })}
				>
					Latest Push Notification ({pushNotifications.length})
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		marginLeft: 10,
		marginRight: 10,
		height: '100%'
	},
	noItems: {
		marginTop: 10,
		textAlign: 'center'
	}
});