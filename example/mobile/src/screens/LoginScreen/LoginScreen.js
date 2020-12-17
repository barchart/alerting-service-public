import { ActivityIndicator, Button, Card, TextInput } from 'react-native-paper';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { setAlerts, setSystem, setTriggers, setUser } from '../../redux/actions/alerts';
import { createManager } from '../../utils/AlertManager';
import { getPushToken } from '../../utils/notifications';

const registerDevice = async (userId) => {
	const token = await getPushToken().then((token) => {
		console.log('Stored token:', token);

		return token;
	});
	
	if (!token) {
		return setTimeout(() => registerDevice(userId), 100);
	}
	
	return axios.post('https://rtfdyn3gtj.execute-api.us-east-1.amazonaws.com/stage/v1/apns/registerDevice', {
		deviceID: token,
		bundleID: 'com.barchart.alerts-client-demo',
		userID: userId,
		realtimeUserID: userId
	}).catch((err) => {
		console.error(err);
	});
};

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
			
			registerDevice(userId);

			setLoading(false);
			
			navigation.reset({
				index: 0,
				routes: [{ name: 'Alerts' }]
			});
		});

		return manager;
	};

	const [host, setHost] = useState('alerts-management-demo.barchart.com');
	const [userId, setUserId] = useState('00000000');
	const [loading, setLoading] = useState(false);
	const system = 'barchart.com';

	return (
		<View style={styles.container}>
			{loading ?
				(<ActivityIndicator style={styles.loading} animation={true} size="large"/>) :
				<Card style={styles.card}>
					<TextInput disabled label="Host" value={host} onChangeText={(value) => setHost(value)} style={styles.margin}/>
					<TextInput label="User Id" value={userId} onChangeText={(value) => setUserId(value)} style={styles.margin}/>
					<Button
						title="Save"
						mode="contained"
						labelStyle={{ color: 'white' }}
						onPress={() => (login(host, userId, system))}
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