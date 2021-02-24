import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { getInstanceIdAndroid } from './notifications';
import { getPushToken } from './asyncStore';
import { Platform } from 'react-native';

const generateJwt = (user, context) => {
	return axios.post('https://jwt-public-stage.aws.barchart.com/v1/tokens/impersonate/alerts/dev', {
		userId: user,
		contextId: context
	}).then((response) => {
		return response.data;
	});
};

const registerDeviceAndroid = async (userId, system) => {
	const token = await getPushToken().then((token) => {
		console.info('Stored token:', token);

		return token;
	});

	if (!token) {
		return setTimeout(() => registerDevice(userId), 500);
	}

	const bundleId = DeviceInfo.getBundleId();

	return generateJwt(userId, system).then(async (jwtToken) => {
		const deviceID = await getInstanceIdAndroid();

		return axios.post('https://push-notifications-stage.aws.barchart.com/v1/fcm/registerDevice', {
			deviceID: deviceID,
			tokenID: token,
			bundleID: bundleId,
			userID: userId
		}, {
			headers: {
				'Authorization': `Bearer ${jwtToken}`
			}
		}).catch((err) => {
			console.error('Register device error:', err);
		});
	});
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
			userID: userId
		}, {
			headers: {
				'Authorization': `Bearer ${jwtToken}`
			}
		}).catch((err) => {
			console.error('Register device error:', err);
		});
	});
};


export const registerDevice = async (userId, system) => {
	if (Platform.OS === 'ios') {
		return registerDeviceIos(userId, system);
	}

	if (Platform.OS === 'android') {
		return registerDeviceAndroid(userId, system);
	}
};