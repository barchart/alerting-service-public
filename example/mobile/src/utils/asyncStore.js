import AsyncStorage from '@react-native-async-storage/async-storage';

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