import { AppRegistry } from 'react-native';

import App from './src/App';
import { name as appName } from './app.json';
import { configureNotifications } from './src/utils/notifications';

// eslint-disable-next-line no-console
// console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);

configureNotifications();