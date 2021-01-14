import AsyncStorage from '@react-native-async-storage/async-storage';
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
	PushNotification.configure({
		onRegister: function (tokenData) {
			const { token } = tokenData;

			getPushToken().then((pushToken) => {
				if (!pushToken) {
					savePushToken(token);
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
		
		permissions: {
			alert: true,
			badge: true,
			sound: true
		}
	});
};