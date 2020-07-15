import React from 'react';
import { NavigationState, NavigationActions } from 'react-navigation';
import { Dispatch } from 'redux';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { AppState } from 'src/types/state';

interface Props {
  navigationState: NavigationState;
  dispatch: Dispatch;
}

class BackButtonHandlerBase extends React.Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, navigationState: state } = this.props;
    const activeNavigatorStack = state.routes[state.index];
    const activeTabStack = activeNavigatorStack.routes[activeNavigatorStack.index];

    if (activeNavigatorStack.index === 0 && activeTabStack.index === 0) {
      return false;
    }

    dispatch(NavigationActions.back());
    return true;
  }

  render() {
    return this.props.children;
  }
}

const mapStateToProps = (state: AppState) => ({
  navigationState: state.navigation,
});

export const BackButtonHandler = connect(mapStateToProps)(BackButtonHandlerBase);
