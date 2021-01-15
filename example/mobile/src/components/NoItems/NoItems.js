/* eslint-disable react/prop-types */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const NoItems = (props) => {
	return (<Text style={styles.noItems}>{props.children}</Text>);
};

const styles = StyleSheet.create({
	noItems: {
		padding: 10,
		textAlign: 'center',
		fontSize: 16
	}
});

export default NoItems;