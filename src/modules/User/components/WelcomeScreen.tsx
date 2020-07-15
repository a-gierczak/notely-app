import React from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import {
  NavigationScreenConfig,
  NavigationScreenOptions,
  NavigationScreenProp,
} from 'react-navigation';
import logo from 'assets/logo.png';
import { PillButton } from 'src/modules/User/components/PillButton';
import Constants from 'expo-constants';
import * as Svg from 'react-native-svg';

interface NavigationProps {
  navigation: NavigationScreenProp<void>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  buttonsWrapper: {
    width: '75%',
    marginTop: 'auto',
    paddingBottom: 40,
    justifyContent: 'center',
  },
  bottomBackgroundContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: -1,
  },
  logo: {
    position: 'absolute',
    width: 171,
    resizeMode: 'contain',
    top: 70,
  },
});

export class WelcomeScreen extends React.Component<NavigationProps> {
  static navigationOptions: NavigationScreenConfig<
    NavigationScreenOptions
  > = () => ({
    header: null,
  })

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.buttonsWrapper}>
          <PillButton
            title="SIGN IN"
            onPress={() => navigation.push('Login')}
          />
          <PillButton
            outline
            title="REGISTER"
            onPress={() => navigation.push('Register')}
          />
        </View>
        <View style={styles.bottomBackgroundContainer}>
          <Svg.Svg
            height={250}
            width={Dimensions.get('window').width}
            viewBox="0 0 100 100"
          >
            <Svg.Defs>
              <Svg.LinearGradient id="grad" x1="0" y1="0" x2="0" y2="100">
                <Svg.Stop offset="0" stopColor="#5fa7b8" stopOpacity="1" />
                <Svg.Stop offset="1" stopColor="#387a8a" stopOpacity="1" />
              </Svg.LinearGradient>
            </Svg.Defs>
            <Svg.Circle
              cx={50}
              cy={360}
              r={350}
              strokeWidth={0}
              fill="url(#grad)"
            />
          </Svg.Svg>
        </View>
      </View>
    );
  }
}
