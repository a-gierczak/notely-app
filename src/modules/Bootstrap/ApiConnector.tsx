import React from 'react';
import { restoreSession } from 'User/reducers/userActions';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { NetInfo } from 'react-native';
import {
  alertConnectionLost,
  alertConnectionRestored,
} from 'src/modules/Alert/reducers/alertActions';
import * as Font from 'expo-font';

interface DispatchProps {
  restoreSessionAction: typeof restoreSession;
  alertConnectionLostAction: typeof alertConnectionLost;
  alertConnectionRestoredAction: typeof alertConnectionRestored;
}

class ApiConnectorBase extends React.Component<DispatchProps> {
  async componentDidMount() {
    await Font.loadAsync({
      'heebo-light': require('assets/fonts/Heebo-Light.ttf'),
      'heebo-thin': require('assets/fonts/Heebo-Thin.ttf'),
      'heebo-regular': require('assets/fonts/Heebo-Regular.ttf'),
      'heebo-medium': require('assets/fonts/Heebo-Medium.ttf'),
      'heebo-bold': require('assets/fonts/Heebo-Bold.ttf'),
      'heebo-extra-bold': require('assets/fonts/Heebo-ExtraBold.ttf'),
      'heebo-black': require('assets/fonts/Heebo-Black.ttf'),
    });

    this.props.restoreSessionAction();
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleNetworkChange,
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleNetworkChange,
    );
  }

  handleNetworkChange = (isConnected: boolean) => {
    if (isConnected) {
      this.props.alertConnectionRestoredAction();
    } else {
      this.props.alertConnectionLostAction();
    }
  }

  render() {
    return this.props.children;
  }
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      restoreSessionAction: restoreSession,
      alertConnectionLostAction: alertConnectionLost,
      alertConnectionRestoredAction: alertConnectionRestored,
    },
    dispatch,
  );

export const ApiConnector = connect(
  null,
  mapDispatchToProps,
)(ApiConnectorBase);
