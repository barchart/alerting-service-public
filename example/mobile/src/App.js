import 'react-native-gesture-handler';
import * as React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import { configureNotifications } from './utils/notifications';

import { HomeScreen } from './screens/HomeScreen/HomeScreen';
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
	configureNotifications();

	return (
		<Provider store={store}>
			<PaperProvider theme={theme}>
				<NavigationContainer>
					<Stack.Navigator>
						<Stack.Screen
							name="Login"
							component={LoginScreen}
							options={{ title: 'Login' }}
						/>
						<Stack.Screen name="Alerts" component={HomeScreen}/>
						<Stack.Screen name="Notifications" component={TriggersScreen}/>
					</Stack.Navigator>
				</NavigationContainer>
			</PaperProvider>
		</Provider>
	);
}
