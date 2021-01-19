import AsyncStorage from '@react-native-async-storage/async-storage';
import iid from '@react-native-firebase/iid';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import * as RootNavigation from '../rootNavigation';
import { setPush } from '../redux/actions/alerts';
import store from '../redux';

export const savePushToken = async (value) => {
	try {
		await AsyncStorage.setItem('@push-token', value);
	} catch (e) {
		console.error('cannot save @push-token');
	}
};

export const getPushToken = async () => {
	try {
		return await AsyncStorage.getItem('@push-token');
	} catch (e) {
		return null;
	}
};

export const configureNotifications = async () => {
	if (Platform.OS === 'ios') {
		console.info('IOS device');
		await configureNotificationsIos();
	}

	if (Platform.OS === 'android') {
		console.info('ANDROID device');
		await configureNotificationsAndroid();
	}
};

async function getInstanceIdAndroid() {
	let id;
	try {
		id = await iid().get();
		console.info('Current Instance ID: ', id);
	} catch (e) {
		console.error(e);
	}

	return id;
}

async function getTokenAndroid() {
	let token;

	try {
		token = await iid().getToken();
		console.info('Current token: ', token);
	} catch (e) {
		console.error(e);
	}

	return token;
}

const configureNotificationsAndroid = async () => {
	configureNotificationsIos();
	await getInstanceIdAndroid();
	await getTokenAndroid();

	return 0;
};

const configureNotificationsIos = () => {
	PushNotification.configure({
		onRegister: function (tokenData) {
			const { token } = tokenData;
			console.info('Token:', token);

			getPushToken().then((pushToken) => {
				if (!pushToken) {
					return savePushToken(token);
				}
			});
		},

		onNotification: function (notification) {
			if (notification.userInteraction) {
				RootNavigation.navigate('Push');
			} else {
				store.dispatch(setPush(notification));
			}

			notification.finish(PushNotificationIOS.FetchResult.NoData);
		},

		requestPermissions: true,

		permissions: {
			alert: true,
			badge: true,
			sound: true
		}
	});
};