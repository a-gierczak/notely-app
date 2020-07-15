import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Animated, Easing } from 'react-native';
import { Text } from 'react-native-elements';
import { register } from 'User/reducers/userActions';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  NavigationScreenProp,
  NavigationScreenConfig,
  NavigationScreenOptions,
} from 'react-navigation';
import { AppState } from 'src/types/state';
import { Token, ValidationError } from 'src/types/common';
import { Color, commonStyles } from 'src/modules/UI/styles';
import { ValidatedInput } from 'src/modules/UI/components/ValidatedInput';
import { PillButton } from 'src/modules/User/components/PillButton';
import Constants from 'expo-constants';
import * as Svg from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  inputContainerWrapper: {
    marginBottom: 40,
  },
  inputContainer: {
    borderColor: Color.LightGrey,
  },
  input: {
    color: Color.MediumGrey,
  },
  buttonContainer: {
    width: 200,
    marginTop: 10,
    marginBottom: 25,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#2089dc',
  },
  headerContainer: {
    flexGrow: 1,
    textAlign: 'left',
    justifyContent: 'center',
  },
  header: {
    color: Color.MediumGrey,
  },
  headerTitle: {
    color: Color.Text,
    fontFamily: 'heebo-regular',
  },
  headerSecondary: {
    color: Color.Primary,
    fontFamily: 'heebo-regular',
    marginBottom: 15,
  },
  formContainer: {
    width: '80%',
    marginBottom: 65,
    backgroundColor: '#fff',
  },
  footerText: {
    color: Color.Text,
    fontFamily: 'heebo-regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 3,
  },
  bottomBackgroundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: -1,
  },
  registerTextContainer: {
    paddingVertical: 20,
  },
  registerText: {
    color: 'rgba(255, 255, 255, .8)',
    fontSize: 12,
  },
  link: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

interface ConnectedProps {
  token: Token | null;
  errors?: ValidationError[];
}

interface DispatchProps {
  registerAction: typeof register;
}

interface NavigationProps {
  navigation: NavigationScreenProp<void>;
}

type Props = NavigationProps & DispatchProps & ConnectedProps;

interface State {
  email?: string;
  password?: string;
  confirmPassword?: string;
  formTranslateTiming: Animated.Value;
}

class RegisterScreenBase extends React.Component<Props, State> {
  animation?: Animated.CompositeAnimation;

  state: State = {
    formTranslateTiming: new Animated.Value(0),
  };

  static navigationOptions: NavigationScreenConfig<
    NavigationScreenOptions
  > = () => ({
    header: null,
  })

  handleInputFocus = () => {
    this.animation = Animated.timing(this.state.formTranslateTiming, {
      toValue: -120,
      duration: 200,
      easing: Easing.ease,
    });

    this.animation.start();
  }

  handleInputBlur = () => {
    this.animation = Animated.timing(this.state.formTranslateTiming, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
    });

    this.animation.start();
  }

  handleEmailChange = (email: string) => {
    this.setState({ email });
  }

  handlePasswordChange = (password: string) => {
    this.setState({ password });
  }

  handleConfirmPasswordChange = (confirmPassword: string) => {
    this.setState({ confirmPassword });
  }

  handleSubmit = () => {
    const { email, password, confirmPassword } = this.state;
    if (email && password && confirmPassword) {
      this.props.registerAction(email, password, confirmPassword);
    }
  }

  render() {
    const { errors, navigation } = this.props;
    const { formTranslateTiming } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text h4 style={styles.header}>Create New Account</Text>
        </View>

        <Animated.View
          style={[
            styles.formContainer,
            {
              transform: [
                { perspective: 1000 },
                { translateY: formTranslateTiming },
              ],
            },
          ]}
        >
          <ValidatedInput
            validationMessages={errors}
            validationName="email"
            containerStyle={styles.inputContainerWrapper}
            inputContainerStyle={styles.inputContainer}
            placeholder="Email"
            onChangeText={this.handleEmailChange}
            value={this.state.email}
            keyboardType="email-address"
            placeholderTextColor={Color.LightGrey}
            inputStyle={styles.input}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
          />

          <ValidatedInput
            validationMessages={errors}
            validationName="password"
            containerStyle={styles.inputContainerWrapper}
            inputContainerStyle={styles.inputContainer}
            placeholder="Password"
            onChangeText={this.handlePasswordChange}
            value={this.state.password}
            secureTextEntry
            placeholderTextColor={Color.LightGrey}
            inputStyle={styles.input}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
          />

          <ValidatedInput
            validationMessages={errors}
            validationName="confirmPassword"
            containerStyle={styles.inputContainerWrapper}
            inputContainerStyle={styles.inputContainer}
            placeholder="Re-enter Password"
            onChangeText={this.handleConfirmPasswordChange}
            value={this.state.confirmPassword}
            secureTextEntry
            placeholderTextColor={Color.LightGrey}
            inputStyle={styles.input}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
          />

          <PillButton raised title="REGISTER" onPress={this.handleSubmit} />

          <Text style={styles.footerText}>
            By clicking Register, you agree to our{' '}
            <Text style={commonStyles.link}>Terms of Service</Text> and that you
            have read our <Text style={commonStyles.link}>Privacy Policy</Text>.
          </Text>
        </Animated.View>

        <View style={styles.registerTextContainer}>
          <TouchableOpacity onPress={() => navigation.push('Login')}>
            <Text style={styles.registerText}>
              Already have an account?{' '}
              <Text style={styles.link}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomBackgroundContainer}>
          <Svg.Svg
            height={60}
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
              cy={4000}
              r={4000}
              strokeWidth={0}
              fill="url(#grad)"
            />
          </Svg.Svg>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      registerAction: register,
    },
    dispatch,
  );

const mapStateToProps = (state: AppState): ConnectedProps => ({
  token: state.user.token,
  errors: state.user.errors,
});

export const RegisterScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterScreenBase);
