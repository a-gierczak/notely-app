import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-elements';
import { AppState } from 'src/types/state';
import { connect } from 'react-redux';
import { RouteIndex } from 'src/modules/Navigation/AppNavigator';
import { Dispatch, bindActionCreators } from 'redux';
import { hideAlert } from 'src/modules/Alert/reducers/alertActions';
import { Color } from 'src/modules/UI/styles';

interface ConnectedProps {
  alertMessage?: string;
  visible: boolean;
}

interface DispatchProps {
  hideAlertAction: typeof hideAlert;
}

interface AlertState {
  translateTiming: Animated.Value;
}

const ALERT_BAR_HEIGHT = 50;

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    height: ALERT_BAR_HEIGHT,
    position: 'absolute',
    bottom: 60,
    left: 0,
    zIndex: 200,
    overflow: 'hidden',
  },
  alertStyle: {
    backgroundColor: Color.MediumGrey,
    flex: 1,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  text: {
    width: '100%',
    color: '#fff',
    textAlign: 'center',
  },
});

class AlertContainerBase extends React.Component<
  ConnectedProps & DispatchProps,
  AlertState
> {
  animation?: Animated.CompositeAnimation;

  state: AlertState = {
    translateTiming: new Animated.Value(ALERT_BAR_HEIGHT),
  };

  componentDidUpdate(prevProps: ConnectedProps) {
    const shouldAnimate =
      (prevProps.alertMessage && !this.props.alertMessage) ||
      (!prevProps.alertMessage && this.props.alertMessage);

    if (shouldAnimate) {
      const toValue =
        prevProps.alertMessage && !this.props.alertMessage ? ALERT_BAR_HEIGHT : 0;

      this.animation = Animated.timing(this.state.translateTiming, {
        toValue,
        duration: 200,
        easing: Easing.ease,
      });

      this.animation.start();
    }
  }

  render() {
    const { alertMessage, visible, hideAlertAction } = this.props;
    const { translateTiming } = this.state;

    if (!(visible && alertMessage)) {
      return null;
    }

    return (
      <View style={styles.containerStyle}>
        <Animated.View
          style={[
            styles.alertStyle,
            {
              transform: [
                { perspective: 1000 },
                { translateY: translateTiming },
              ],
            },
          ]}
        >
          <TouchableOpacity style={styles.textContainer} onPress={hideAlertAction}>
            <Text style={styles.text}>{alertMessage}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState): ConnectedProps => ({
  alertMessage: state.alert.message,
  visible: state.navigation.index === RouteIndex.APP,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      hideAlertAction: hideAlert,
    },
    dispatch,
  );

export const AlertContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlertContainerBase);
