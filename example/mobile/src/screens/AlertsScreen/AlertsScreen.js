/* eslint-disable camelcase */
import { ScrollView, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import React from 'react';

import AlertsList from '../../components/AlertsList/AlertsList';
import NoItems from '../../components/NoItems/NoItems';

export const AlertsScreen = ({ route }) => {
	const { alerts } = route.params;
	alerts.sort((b, a) => b.create_date - a.create_date);

	return (
		<ScrollView style={styles.container}>
			<Card>
				{!alerts.length ? (<NoItems>You don't have alerts</NoItems>) : <AlertsList alerts={alerts}/>}
			</Card>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		marginLeft: 10,
		marginRight: 10,
		height: '100%'
	},
	noItems: {
		marginTop: 10,
		textAlign: 'center'
	}
});