import { ActivityIndicator, Button, Card, TextInput } from 'react-native-paper';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { setAlerts, setSystem, setTriggers, setUser } from '../../redux/actions/alerts';
import { createManager } from '../../utils/AlertManager';
import PushNotificationProvider from '../../utils/PushNotificationProvider';

export const LoginScreen = ({ navigation }) => {
	const dispatch = useDispatch();

	const login = async (host, userId, system) => {
		setLoading(true);
		const manager = await createManager(host, userId, system);

		dispatch(setUser(userId));
		dispatch(setSystem(system));

		Promise.all([
			// eslint-disable-next-line camelcase
			manager.retrieveTriggers({ user_id: userId, alert_system: system }),
			// eslint-disable-next-line camelcase
			manager.retrieveAlerts({ user_id: userId, alert_system: system })
		]).then((results) => {
			dispatch(setTriggers(results[0]));
			dispatch(setAlerts(results[1]));

			const pushNotificationProvider = new PushNotificationProvider();
			
			pushNotificationProvider.registerDevice(userId, system);

			setLoading(false);

			navigation.reset({
				index: 0,
				routes: [{ name: 'Home' }]
			});
		});

		return manager;
	};

	const [host, setHost] = useState('alerts-management-demo.barchart.com');
	const [userId, setUserId] = useState('00000000');
	const [loading, setLoading] = useState(false);
	const [alertSystem, setAlertSystem] = useState('barchart.com');

	return (
		<View style={styles.container}>
			{loading ?
				(<ActivityIndicator style={styles.loading} animation={true} size="large"/>) :
				<Card style={styles.card}>
					<TextInput disabled label="Host" value={host} onChangeText={(value) => setHost(value)} style={styles.margin}/>
					<TextInput label="Alert System" disabled value={alertSystem} onChangeText={(value) => setAlertSystem(value)} style={styles.margin}/>
					<TextInput label="User Id" value={userId} onChangeText={(value) => setUserId(value)} style={styles.margin}/>
					<Button
						title="Save"
						mode="contained"
						labelStyle={{ color: 'white' }}
						onPress={() => (login(host, userId, alertSystem))}
					>
						Login
					</Button>
				</Card>
			}
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
	margin: {
		marginBottom: 10
	},
	card: {
		padding: 15
	},
	loading: {
		flex: 1,
		alignContent: 'center',
		justifyContent: 'center'
	}
});