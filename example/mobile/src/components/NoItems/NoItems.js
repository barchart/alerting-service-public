/* eslint-disable react/prop-types */
import { Headline } from 'react-native-paper';
import React from 'react';
import { StyleSheet } from 'react-native';

const NoItems = (props) => {
	return (<Headline style={styles.noItems}>{props.children}</Headline>);
};

const styles = StyleSheet.create({
	noItems: {
		marginTop: 10,
		textAlign: 'center'
	}
});

export default NoItems;