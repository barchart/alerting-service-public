import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { useSelector } from 'react-redux';

import NoItems from '../../components/NoItems/NoItems';
import TriggersList from '../../components/TriggersList/TriggersList';

export const TriggersScreen = () => {
	const triggers = useSelector((state) => state.alerts.triggers.sort((a, b) => b.trigger_date - a.trigger_date));

	return (
		<ScrollView style={styles.container}>
			<Card>
				{!triggers.length ? (<NoItems>You don't have notifications</NoItems>) : <TriggersList triggers={triggers}/>}
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