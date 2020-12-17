import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

export const savePushToken = async (value) => {
	try {
		await AsyncStorage.setItem('@push-token', value);
	} catch (e) {
		console.log('cannot save @push-token');
	}
};

export const getPushToken = async () => {
	try {
		const value = await AsyncStorage.getItem('@push-token');

		return value;
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
			notification.finish(PushNotificationIOS.FetchResult.NoData);
		},
		permissions: {
			alert: true,
			badge: true,
			sound: true
		}
	});
};