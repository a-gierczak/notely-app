import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DotIndicator } from 'react-native-indicators';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, .2)',
    zIndex: 200,
  },
});

export const Loader = () => (
  <View style={styles.container}>
    <DotIndicator size={10} color="#FFFFFF" />
  </View>
);
