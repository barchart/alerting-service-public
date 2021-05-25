import iid from '@react-native-firebase/iid';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import * as RootNavigation from '../rootNavigation';
import { getPushToken, savePushToken } from './asyncStore';
import { setPush } from '../redux/actions/alerts';
import store from '../redux';

export const configureNotifications = async () => {
	if (Platform.OS === 'ios') {
		console.debug('IOS device');
		configureNotificationsIos();
	}

	if (Platform.OS === 'android') {
		console.debug('ANDROID device');
		await configureNotificationsAndroid();
	}
};

export async function getInstanceIdAndroid() {
	let id;
	try {
		id = await iid().get();
	} catch (e) {
		console.error(e);
	}

	return id;
}

export async function getTokenAndroid() {
	let token;

	try {
		token = await iid().getToken();
	} catch (e) {
		console.error(e);
	}

	return token;
}

const configureNotificationsAndroid = async () => {
	configureNotificationsIos();
};

const configureNotificationsIos = () => {
	PushNotification.configure({
		onRegister: function (tokenData) {
			const { token } = tokenData;
			console.debug('Token:', token);
			if (Platform.OS === 'android') {
				getInstanceIdAndroid().then((deviceID) => {
					console.debug('Instance ID:', deviceID);
				});
			}

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