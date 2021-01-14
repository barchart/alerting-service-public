import 'react-native-gesture-handler';
import * as React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import { navigationRef } from './rootNavigation';

import { AlertsScreen } from './screens/AlertsScreen/AlertsScreen';
import { HomeScreen } from './screens/HomeScreen/HomeScreen';
import { LatestPushNotification } from './screens/LatestPushScreen/LatestPushScreen';
import { LoginScreen } from './screens/LoginScreen/LoginScreen';
import { TriggersScreen } from './screens/TriggersScreen/TriggersScreen';

import store from './redux';

const theme = {
	...DefaultTheme,
	roundness: 2,
	colors: {
		...DefaultTheme.colors,
		primary: '#3498db',
		accent: '#f1c40f'
	}
};

const Stack = createStackNavigator();

export default function App() {
	return (
		<Provider store={store}>
			<PaperProvider theme={theme}>
				<NavigationContainer ref={navigationRef}>
					<Stack.Navigator>
						<Stack.Screen
							name="Login"
							component={LoginScreen}
							options={{ title: 'Login' }}
						/>
						<Stack.Screen name="Home" component={HomeScreen}/>
						<Stack.Screen name="Triggered" options={{ title: 'Triggered Alerts' }} component={TriggersScreen}/>
						<Stack.Screen name="Push" options={{ title: 'Latest Push Notifications' }} component={LatestPushNotification}/>
						<Stack.Screen name="Alerts" component={AlertsScreen}/>
					</Stack.Navigator>
				</NavigationContainer>
			</PaperProvider>
		</Provider>
	);
}
