/* eslint-disable camelcase */
import { Card, Text } from 'react-native-paper';
import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';

import NoItems from '../../components/NoItems/NoItems';

export const LatestPushNotification = () => {
	const latestPush = useSelector((state) => state.alerts.push);

	return (
		<ScrollView style={styles.container}>

			{!latestPush.length ? (<Card><NoItems>You haven't received push notifications in this session</NoItems></Card>) : (
				<View>
					{latestPush.map((push) => {
						const latestPushString = JSON.stringify(push, null, 2);

						return (
							<Card key={push.data.notificationId ? push.data.notificationId : push.id} style={{ marginBottom: 10, padding: 10 }}>
								<Text style={{ fontSize: 16 }}>{latestPushString}</Text>
							</Card>
						);
					})}
				</View>
			)}
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