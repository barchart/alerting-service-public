import assert from '@barchart/common-js/lang/assert';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

import { getInstanceIdAndroid } from './notifications';
import { getPushToken } from './asyncStore';
import { Platform } from 'react-native';

export default (() => {
	class PushNotificationProvider {
		async registerDevice(userId, system) {
			assert.argumentIsRequired(userId, 'userId', String);
			assert.argumentIsRequired(system, 'system', String);
			
			const token = await getPushToken().then((token) => {
				console.debug('Stored token:', token);

				return token;
			});

			if (!token) {
				return setTimeout(() => this.registerDevice(), 500);
			}

			const query = {
				user: {
					id: userId,
					context: 'barchart'
				},
				provider: 'barchart',
				development: true
			};

			const bundleId = DeviceInfo.getBundleId();

			if (Platform.OS === 'ios') {
				query.apns = {
					device: token,
					bundle: bundleId
				};
			}

			if (Platform.OS === 'android') {
				const iid = await getInstanceIdAndroid();

				query.fcm = {
					token: token,
					package: bundleId,
					iid: iid
				};

				query.provider = 'barchart.test.com';
			}

			return sendRegisterRequest(query);
		}
	}

	const sendRegisterRequest = (query) => {
		return generateJwt(query.user.id, query.user.context).then((jwtToken) => {
			console.debug(`JWT Token: ${jwtToken}`);

			const config = {
				headers: { 'Authorization': `Bearer ${jwtToken}` }
			};

			return axios.post('https://push-notifications-stage.aws.barchart.com/v2/register', query, config).then((response) => {
				console.debug('Device Registered:', JSON.stringify(response.data));
			}).catch((err) => {
				console.error('Register device error:', err);
			});
		});
	};

	const generateJwt = (userId, contextId) => {
		return axios.post('https://jwt-public-stage.aws.barchart.com/v1/tokens/impersonate/ens/stage', {
			userId: userId,
			contextId: contextId
		}).then((response) => {
			return response.data;
		});
	};

	return PushNotificationProvider;
})();