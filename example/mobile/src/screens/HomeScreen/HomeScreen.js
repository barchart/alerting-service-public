import { Button, Card } from 'react-native-paper';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

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
		// eslint-disable-next-line camelcase
		manager.retrieveTriggers({ user_id: `${userID}`, alert_system: system }).then((triggers) => {
			dispatch(setTriggers(triggers));
		});
	}, [userID, system, manager, dispatch]);

	const handleSubscribeAlerts = useCallback(() => {
		// eslint-disable-next-line camelcase
		manager.retrieveAlerts({ user_id: `${userID}`, alert_system: system }).then((alerts) => {
			dispatch(setAlerts(alerts));
		});
	}, [userID, system, manager, dispatch]);

	if (manager) {
		// eslint-disable-next-line camelcase
		manager.subscribeTriggers({ user_id: userID, alert_system: system }, handleSubscribeTriggers, handleSubscribeTriggers, handleSubscribeTriggers);
		// eslint-disable-next-line camelcase
		manager.subscribeAlerts({ user_id: userID, alert_system: system }, handleSubscribeAlerts, handleSubscribeAlerts, handleSubscribeAlerts, handleSubscribeTriggers);
	}

	return (
		<ScrollView style={styles.container}>
			<Card>
				{!alerts.length ? (<NoItems>You don't have alerts</NoItems>) : <AlertsList alerts={alerts}/>}
			</Card>
			<View style={{ width: '100%', marginTop: 10 }}>
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