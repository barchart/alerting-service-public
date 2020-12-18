/* eslint-disable camelcase */
import { Button, Card } from 'react-native-paper';
import React, { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DisposableStack from '@barchart/common-js/collections/specialized/DisposableStack';

import { setAlerts, setTriggers } from '../../redux/actions/alerts';
import { getManager } from '../../utils/AlertManager';

import AlertsList from '../../components/AlertsList/AlertsList';
import NoItems from '../../components/NoItems/NoItems';

export const HomeScreen = ({ navigation }) => {
	const alerts = useSelector((state) => state.alerts.alerts.sort((b, a) => b.create_date - a.create_date));
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
		const disposables = new DisposableStack();

		if (manager) {
			const triggerDisposable = manager.subscribeTriggers({
				user_id: userID,
				alert_system: system
			}, handleSubscribeTriggers, handleSubscribeTriggers, handleSubscribeTriggers);
			const alertsDisposable = manager.subscribeAlerts({
				user_id: userID,
				alert_system: system
			}, handleSubscribeAlerts, handleSubscribeAlerts, handleSubscribeAlerts, handleSubscribeTriggers);

			disposables.push(triggerDisposable);
			disposables.push(alertsDisposable);
		}

		return () => disposables.dispose();
	}, []);

	return (
		<ScrollView style={styles.container}>
			<View style={{ width: '100%', marginBottom: 10 }}>
				<Button
					title="Notifications"
					mode="contained"
					icon="bell"
					labelStyle={{ color: 'white' }}
					onPress={() => navigation.navigate({ name: 'Notifications' })}
				>
					Notifications
				</Button>
			</View>
			<Card>
				{!alerts.length ? (<NoItems>You don't have alerts</NoItems>) : <AlertsList alerts={alerts}/>}
			</Card>
		</ScrollView>
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