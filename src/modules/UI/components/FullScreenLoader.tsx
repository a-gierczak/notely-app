import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DotIndicator } from 'react-native-indicators';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const FullScreenLoader: React.SFC<{}> = () => (
  <View style={styles.screen}>
    <LinearGradient
      colors={['#30566e', '#467a9a', '#537a93']}
      style={styles.gradient}
    >
      <DotIndicator size={10} color="#FFFFFF" />
    </LinearGradient>
  </View>
);
