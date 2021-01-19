import { ActivityIndicator, Button, Card, TextInput } from 'react-native-paper';
import { Platform, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { setAlerts, setSystem, setTriggers, setUser } from '../../redux/actions/alerts';
import { createManager } from '../../utils/AlertManager';
import { getPushToken } from '../../utils/notifications';

const generateJwt = (user, context) => {
	return axios.post('https://jwt-public-stage.aws.barchart.com/v1/tokens/impersonate/alerts/dev', {
		userId: user,
		contextId: context
	}).then((response) => {
		return response.data;
	});
};

const registerDevice = async (userId, system) => {
	if (Platform.OS === 'ios') {
		return registerDeviceIos(userId, system);
	}
	
	if (Platform.OS === 'android') {
		return registerDeviceAndroid(userId, system);
	}
};

const registerDeviceAndroid = async (userId, system) => {
	console.info(userId, system);
};

const registerDeviceIos = async (userId, system) => {
	const token = await getPushToken().then((token) => {
		console.info('Stored token:', token);

		return token;
	});

	if (!token) {
		return setTimeout(() => registerDevice(userId), 500);
	}
	
	const bundleId = DeviceInfo.getBundleId();

	return generateJwt(userId, system).then((jwtToken) => {
		return axios.post('https://push-notifications-stage.aws.barchart.com/v1/apns/registerDevice', {
			deviceID: token,
			bundleID: bundleId,
			userID: `${userId}@${system}`
		}, {
			headers: {
				'Authorization': `Bearer ${jwtToken}`
			}
		}).catch((err) => {
			console.error('Register device error:', err);
		});
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

			registerDevice(userId, system);

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